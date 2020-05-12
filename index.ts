import {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    Mesh,
    BoxGeometry,
    PointLight,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new Scene();
const box = new Mesh(new BoxGeometry(1, 1, 1));
scene.add(box);

const loader = new GLTFLoader();
/* loader.load("bird.gltf.glb", (gltf) => {
    gltf.scene.scale.multiplyScalar(100);

    scene.add(gltf.scene);
}); */

const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
camera.position.z = 5;

const light = new PointLight();
light.position.set(5, 15, 10);
scene.add(light);

const renderer = new WebGLRenderer();
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.enableDamping = true;

updateSizeToWindow();

window.addEventListener("resize", updateSizeToWindow);

animate();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function updateSizeToWindow() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
