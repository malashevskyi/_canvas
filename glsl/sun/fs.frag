varying vec2 vUv;
uniform float u_time;
uniform sampler2D texture;

void main() {
  float distortX = abs(sin(vUv.x * 150.0 + u_time) * 0.001);
  float distortY = cos(vUv.x * 200.0 + u_time) * 0.001;
  // float distortX = 0.0;
  // float distortY = 0.0;
  vec4 color = texture2D(texture, vec2(vUv.x + distortX, vUv.y + distortY));

  gl_FragColor = vec4(vec3(color.xyz), 0.33);
}