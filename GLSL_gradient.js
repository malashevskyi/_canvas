
const createShader = require('canvas-sketch-util/shader');
const glsl = require('glslify');


const canvasSketch = require('canvas-sketch');

const settings = {
  animate: true,
  context: 'webgl',
};

const sketch = ({ context, height, width, gl }) => {
  const frag = glsl(/* glsl */ `
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_time;

    void main () {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;

      vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0.0, 2.0, 4.0));

      gl_FragColor = vec4(col,1.0);
    }
  `);

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
