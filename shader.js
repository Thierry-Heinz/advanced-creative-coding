// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
const glsl = require("glslify");

const canvasSketch = require("canvas-sketch");

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
  renderer.setClearColor("#fff", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32,16);
  const baseGeom = new THREE.IcosahedronGeometry(1,0);

  const points =  getVertices(baseGeom);

  const jsonPoints = points.map(JSON.stringify)
  const uniquePointsSet = new Set (jsonPoints);
  const uniquePoints = Array.from(uniquePointsSet).map(JSON.parse);
  console.log([...new Set(points)]);

  const circleGeom = new THREE.CircleGeometry(1,32);
  uniquePoints.forEach(point =>{
    const mesh = new THREE.Mesh(
      circleGeom,
      new THREE.MeshBasicMaterial(
        {
          color:"black",
          side: THREE.DoubleSide
        }
      ));
      mesh.position.copy(point);
      mesh.scale.setScalar(0.15);
      mesh.lookAt( new THREE.Vector3());
      scene.add(mesh);
  });

  const vertexShader = /* glsl */ `
  varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz,1.0);
    }
  `;
const fragmentShader = glsl(/* glsl */`
  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  varying vec2 vUv;
  uniform vec3 color;
  uniform float time;
  void main() {    
    gl_FragColor = vec4(vec3(color), 1.0);
  }
`);
  // Setup a material
  const material = new THREE.ShaderMaterial({
    transparent: false,
    uniforms: {
      time: {
        value:0
      },
      color: {
        value: new THREE.Color("tomato")
      }
    },
    fragmentShader,
    vertexShader
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
      material.uniforms.time.value = time
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


/// functionnal
    function getVertices(geom) {
      let positions = geom.attributes.position.array;
      let count = positions.length / 3;
      let datas = [];
      for (let i = 0; i < count; i++) {
          datas.push( new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]) );
      }
      return datas;
  }
  function removeDuplicates(arr) {
        return arr.filter((item, 
            index) => arr.indexOf(item) === index);
    }
