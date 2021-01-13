// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require('three');
// require('three/examples/js/controls/OrbitControls');
const canvasSketch = require('canvas-sketch');

import fragmentShader from './fs.frag';
import vertexShader from './vs.frag';

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
};

const sketch = ({ context, time, width, height }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor('#000', 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera( 50, 1, 0.01, 100 );
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  // const controls = new THREE.OrbitControls(
  //   camera,
  //   context.canvas
  // );

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  let geometry = new THREE.PlaneGeometry(2, 2);

  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    './../../images/pexels-louise.jpg',
    fitTexture
  );

  const uniforms = {
    u_time: { value: 3.1 },
    u_resolution: {
      value: {
        x: 0,
        y: 0,
      },
    },
    texture: { value: texture },
    u_size: { value: '' },
  };

  // Setup a material
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  // Setup a mesh with geometry + material
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  function fitTexture() {
    // if the texture larger than canvas
    let d = Math.max(
      texture.image.height / height,
      texture.image.width / width,
      1
    );

    const aspectY = height * d / texture.image.height;
    const aspectX = width * d / texture.image.width;

    geometry.scale(
      texture.image.width / d / width,
      texture.image.height / d / height,
      1
    );

    // then scale if necessary
    if (aspectY > 1) geometry.scale(aspectY, aspectY, 1);
    if (aspectX > 1) geometry.scale(aspectX, aspectX, 1);
  }

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
    render(props) {
      const { canvasHeight, canvasWidth } = props;
      
      material.uniforms.u_resolution.value.x = canvasWidth;
      material.uniforms.u_resolution.value.y = canvasHeight;
      material.uniforms.u_size.value = new THREE.Vector2(
        texture.image?.width,
        texture.image?.height
      );

      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
