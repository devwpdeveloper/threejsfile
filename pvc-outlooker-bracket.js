// Set up the scene, camera, and renderer
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x1D527C);

// Set up the camera
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 4;

// Set up the renderer with shadows enabled
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Add ambient light to the scene
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light to the scene with shadows enabled
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-10, 10, 10);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Define the bar's geometry and material
var barGeometry1 = new THREE.BoxGeometry(0.2, 2, 0.5);
var barGeometry = new THREE.BoxGeometry(0.3, 1.8, 0.3);
var barGeometry2 = new THREE.BoxGeometry(0.3,1.8,0.3);

var barMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

// Create the first bar
var bar1 = new THREE.Mesh(barGeometry1, barMaterial);
bar1.rotation.x = Math.PI;
bar1.position.set(0, -0.35, 0);
bar1.castShadow = true;
bar1.receiveShadow = true;

// Create the second bar
var bar2 = new THREE.Mesh(barGeometry, barMaterial);
bar2.rotation.z = Math.PI / 2;
bar2.position.set(0.9, 0.5, 0);
bar2.castShadow = true;
bar2.receiveShadow = true;

var bar3 =  new THREE.Mesh(barGeometry2, barMaterial);
bar3.rotation.z = Math.PI / -4;
bar3.position.set(0.64, -0.1, 0);
bar3.castShadow = true;
bar3.receiveShadow = true;


// Create the brace
var braceGeometry = new THREE.BoxGeometry(1.3, 0.1, 0.3);
var braceMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframeLinewidth: 90  });
var brace = new THREE.Mesh(braceGeometry, braceMaterial);
brace.position.set(0.4, 0.03, 0);
brace.rotation.z = Math.PI / -4;
brace.castShadow = true;
brace.receiveShadow = true;

// const geometry = new THREE.SphereGeometry( 15, 32, 16 );
// const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// const sphere = new THREE.Mesh( geometry, material );


const curve = new THREE.EllipseCurve(
    0.8,  0.1,            // ax, aY
    1, 1,           // xRadius, yRadius
    1,  Math.PI,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0.3                 // aRotation
);

const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );

const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );



// Create the final object to add to the scene
const ellipse = new THREE.Line( geometry, material);

ellipse.position.set(0.4, -0.8, 0);

// Create a group to hold both bars and the brace
var shape = new THREE.Group();
shape.add(bar1);
shape.add(bar2);
shape.add(bar3);
shape.add(brace);
shape.add( ellipse );
scene.add(shape);

// Define the mouse drag function to rotate the shape
var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};
function onMouseDown(event) {
    isDragging = true;
}
function onMouseUp(event) {
    isDragging = false;
}
function onMouseMove(event) {
    if (isDragging) {
        var deltaMove = {
            x: event.offsetX - previousMousePosition.x,
            y: event.offsetY - previousMousePosition.y
        };
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 0.1),
                toRadians(deltaMove.x * 0.1),
                0,
                'XYZ'
            ));
        shape.quaternion.multiplyQuaternions(deltaRotationQuaternion, shape.quaternion);
    }
    previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
    };
}
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('mousemove', onMouseMove, false);

// Set up the render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Helper function to convert degrees to radians
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}
