
import createShader from 'canvas-sketch-util/shader';
import canvasSketch from 'canvas-sketch';

import { frag } from './fs';

const settings = {
  animate: true,
  context: 'webgl',
};

const sketch = ({ height, width, gl }) => {
  return createShader({
    clearColor: 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      u_time: ({ time }) => time,
      u_resolution: [width, height],
      u_aspect: ({ width, height }) => width / height,
    },
  });
};

canvasSketch(sketch, settings);
