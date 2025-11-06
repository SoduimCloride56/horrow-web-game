import * as THREE from 'three';

// Scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('gameCanvas')});
renderer.setSize(window.innerWidth, window.innerHeight);

// Floor
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshStandardMaterial({color: 0x111111});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Lighting (flashlight)
const flashlight = new THREE.SpotLight(0xffffff, 2);
flashlight.angle = Math.PI / 6;
flashlight.penumbra = 0.2;
flashlight.position.set(0, 1.5, 0);
scene.add(flashlight);

// Player
const player = { x: 0, y: 1.5, z: 0, speed: 0.1 };

// Enemy
const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
const enemyMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
enemy.position.set(5, 0.5, 5);
scene.add(enemy);

// Lights
const ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

// Movement
const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// Flashlight toggle
let flashlightOn = true;
document.addEventListener('keydown', e => {
    if(e.key === 'f') {
        flashlightOn = !flashlightOn;
        flashlight.visible = flashlightOn;
    }
});

// Pointer Lock Controls
const controls = new THREE.PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', () => controls.lock());

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Player movement
    if(keys['w']) player.z -= player.speed;
    if(keys['s']) player.z += player.speed;
    if(keys['a']) player.x -= player.speed;
    if(keys['d']) player.x += player.speed;
    controls.getObject().position.set(player.x, player.y, player.z);
    flashlight.position.copy(controls.getObject().position);
    flashlight.target.position.set(player.x + 0, player.y, player.z - 1);

    // Enemy AI (move toward player)
    const dir = new THREE.Vector3(player.x - enemy.position.x, 0, player.z - enemy.position.z);
    if(dir.length() > 0.5) {
        dir.normalize();
        enemy.position.add(dir.multiplyScalar(0.02));
    }

    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
