precision highp float;

uniform vec2 u_resolution;

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.x;

  vec3 col = vec3(0.0, 0.0, 0.0);

  float thickness = 0.001;
  if (abs(uv.x) < thickness)
    col.g = 1.0;
  if (abs(uv.y) < thickness)
    col.r = 1.0;

  gl_FragColor = vec4(col, 1.0);
}