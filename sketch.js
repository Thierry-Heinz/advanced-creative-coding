// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { Vector3 } = require("three");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 10, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 20);
  
  const loader = new THREE.TextureLoader();
  const earthTexture = loader.load('earth.jpg');
  const moonTexture = loader.load('moon.jpg');

  // Setup a material
  const material = new THREE.MeshStandardMaterial({
    //color: "blue",
    //flatShading: true,
    roughness: 1,
    metalness: 0,
    map: moonTexture
  });


  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);


  const moonGroup = new THREE.Group();
  const moonMaterial = new THREE.MeshStandardMaterial({
    roughness: 1,
    metalness: 0,
    map: earthTexture
  })
  const moonMesh = new THREE.Mesh(geometry, moonMaterial);
  moonMesh.position.set(2.5,-0.05,0);
  moonMesh.scale.setScalar(0.25);
  moonGroup.add(moonMesh);

  
  
  const orbitGeometry = new THREE.TorusGeometry(1, 0.0025, 16, 100);
  const orbitMaterial = new THREE.MeshBasicMaterial({color: '#fff'});
  const orbitMesh = new THREE.Mesh( orbitGeometry, orbitMaterial);
  orbitMesh.position.set(0,0,0);
  orbitMesh.rotation.x = 1.57;
  orbitMesh.scale.setScalar(2.5);
  
  moonGroup.add(orbitMesh);
  
  scene.add(moonGroup);

  const light = new THREE.PointLight("white", 1.5);
  light.position.set(5,3,2);
  moonGroup.add(light);
  scene.add(new THREE.GridHelper(10, 50));
  scene.add(new THREE.PointLightHelper(light, 0.1));
  scene.add(new THREE.AxesHelper(15));
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      mesh.rotation.y = time*0.05;
      moonMesh.rotation.y = time*0.235;

      moonGroup.rotation.y = time*0.15;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
