// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");

import fragmentShader from './fs.frag';
import vertexShader from './vs.vert';

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context, width, height }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);

  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    './../../images/pexels-louise.jpg',
    fitTexture
  );
  const map = loader.load(
    './../../images/pexels-louise-map-2.jpg',
  );

  function fitTexture() {
    // if the texture larger than canvas
    let d = Math.max(
      texture.image.height / height,
      texture.image.width / width,
      1
    );
    geometry.scale(
      texture.image.width / d / width,
      texture.image.height / d / height,
      1
    );
  }

  const uniforms = {
    u_time: { value: 0.0 },
    texture: { value: texture },
    map: { value: map }
  };
  // Setup a material
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
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
      material.uniforms.u_time.value = time
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
