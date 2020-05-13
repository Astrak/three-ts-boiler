import {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    PointLight,
    Mesh,
    RingBufferGeometry,
    MeshBasicMaterial
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ARButton } from "three/examples/jsm/webxr/ARButton";

let hitTestSource = null;
let hitTestSourceRequested = false;

let enableXR = false;

const scene = new Scene();

let model;
const loader = new GLTFLoader();
loader.load("monkey.glb", gltf => {
    model = gltf.scene;
});

const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.01, 1000);
camera.position.z = 5;

const light = new PointLight();
light.position.set(5, 15, 10);
scene.add(light);

const renderer = new WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio)
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
if (enableXR) {
    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.enableDamping = true;

const reticle = new Mesh(
    new RingBufferGeometry(0.15, 0.2, 64).rotateX(- Math.PI / 2),
    new MeshBasicMaterial({ opacity: 0.5, transparent: true, color: 0xaabbff })
)
reticle.matrixAutoUpdate = false;
reticle.visible = false;
scene.add(reticle);

function onSelect() {
    if (reticle.visible && model !== undefined) {
        const clone = model.clone();
        clone.position.setFromMatrixPosition(reticle.matrix);
        scene.add(clone);
    }
}
const controller = renderer.xr.getController(0);
scene.add(controller);
controller.addEventListener('select', onSelect);

updateSizeToWindow();

window.addEventListener("resize", updateSizeToWindow);

renderer.setAnimationLoop((timeStamp, frame) => {
    controls.update();
    renderer.render(scene, camera);
    if (frame) {
        let referenceSpace = renderer.xr.getReferenceSpace();
        let session = renderer.xr.getSession();

        if (hitTestSourceRequested === false) {
            session.requestReferenceSpace('viewer').then(function (referenceSpace) {
                session.requestHitTestSource({ space: referenceSpace }).then(function (source) {
                    hitTestSource = source;
                });
            });
            session.addEventListener('end', function () {
                hitTestSourceRequested = false;
                hitTestSource = null;
            });
            hitTestSourceRequested = true;
        }

        if (hitTestSource) {
            var hitTestResults = frame.getHitTestResults(hitTestSource);
            if (hitTestResults.length) {
                var hit = hitTestResults[0];
                reticle.visible = true;
                reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
            } else {
                reticle.visible = false;
            }
        }
    }
});

function updateSizeToWindow() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
