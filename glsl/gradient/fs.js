import glsl from 'glslify';

export const frag = glsl(/* glsl */ `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;

  void main () {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    vec3 col = (cos(u_time + uv.xyx + vec3(0.0, 2.0, 4.0)));

    gl_FragColor = vec4(col,1.0);
  }
`);