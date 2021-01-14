varying vec2 vUv;
uniform float u_time;
uniform sampler2D texture;
uniform sampler2D map;

void main() {
  float distort = sin(vUv.x * 30.0 + u_time) * 0.009;
  float map = texture2D(map, vUv).r;
  vec4 color = texture2D(texture, vec2(vUv.x + distort * map, vUv.y));

  gl_FragColor = vec4(vec3((color.r * 0.2 + color.g + 0.7, color.b + 0.07) / 3.0), 1.0);
}