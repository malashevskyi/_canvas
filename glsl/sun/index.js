// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');

// Include any additional ThreeJS examples below
require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');

import fragmentShader from './fs.frag';
import vertexShader from './vs.vert';

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
};

const sketch = ({ context, time }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor('black');
  // Setup a camera
  const camera = new THREE.PerspectiveCamera(
    50,
    1,
    0.01,
    100
  );
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(
    camera,
    context.canvas
  );

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(0.998, 50, 50);
  const geometry2 = new THREE.SphereGeometry(1, 50, 50);
  const geometry3 = new THREE.SphereGeometry(1.003, 50, 50);

  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    './../../images/2k_sun.jpg'
    // fitTexture
  );

  const uniforms = {
    u_time: { value: 0 },
    texture: { value: texture },
  };

  // Setup a material
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });
  material.transparent = true;

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  const mesh2 = new THREE.Mesh(geometry2, material);
  const mesh3 = new THREE.Mesh(geometry3, material);
  mesh3.rotation.y = Math.PI;
  // mesh2.position.x = 1;
  scene.add(mesh);
  scene.add(mesh2);
  scene.add(mesh3);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(
        viewportWidth,
        viewportHeight,
        false
      );
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      mesh.rotation.y += 0.0003;
      mesh2.rotation.y -= 0.0003;
      mesh3.rotation.x -= 0.0003;

      material.uniforms.u_time.value = time;

      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);