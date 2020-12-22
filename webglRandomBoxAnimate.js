global.THREE = require('three');
require('three/examples/js/controls/OrbitControls');

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');

const settings = {
  dimensions: [500, 500],
  animate: true,
  context: 'webgl',
  duration: 4,
  fps: 24,
  attribute: { antialias: true },
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor('#000', 1);

  const camera = new THREE.OrthographicCamera();
  const scene = new THREE.Scene();

  const palette = random.pick(palettes);
  const box = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 60; i++) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
      })
    );

    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );

    mesh.scale.multiplyScalar(.4);

    scene.add(mesh);
  }

  const light = new THREE.DirectionalLight('red', 0.7);
  light.position.set(0, 0, 1);
  scene.add(light);
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      const aspect = viewportWidth / viewportHeight;
      const zoom = 2;
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      camera.near = -100;
      camera.far = 100;

      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      const t = Math.sin(playhead * Math.PI * 2) * 2;
      scene.rotation.z = eases.expoInOut(t);
      // controls.update();
      renderer.render(scene, camera);
    },
    unload() {
      // controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
