const createShader = require('canvas-sketch-util/shader');
// import { frag } from './rgbMix';
// import { frag } from './axes';
import { frag } from './test';

const canvasSketch = require('canvas-sketch');

const settings = {
  animate : true,
  // dimensions: [1000, 1000],
  context : 'webgl',
};

const sketch = ({context, height, width, gl}) => {
  return createShader({
    clearColor : 'white',
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms : {
      u_time : (props) => {
        // console.log(props);
        return props.time;
      },
      u_resolution : ({canvasHeight, canvasWidth}) => {
        // let el = document.querySelector('body > canvas');
        // console.log(el.style.width);
        // console.log('props', props);
        return [ canvasWidth, canvasHeight ];
      },
      u_aspect : ({width, height}) => width / height,
      u_mouse : (props) => { console.log(props); },
    },
  });
};

canvasSketch(sketch, settings);
