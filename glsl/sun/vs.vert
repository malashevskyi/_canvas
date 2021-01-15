varying vec2 vUv;
uniform vec2 u_size;
uniform vec2 u_resolution;

// void main() {
//   vUv = uv;

//   gl_Position = vec4(position.xyz, 1.0);
// }

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}