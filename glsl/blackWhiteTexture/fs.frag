varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D texture;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec4 color = texture2D(texture, vUv);

  gl_FragColor = vec4(vec3((color.r * 0.2126 + color.g + 0.7152, color.b + 0.0722) / 3.0), 1.0);
}