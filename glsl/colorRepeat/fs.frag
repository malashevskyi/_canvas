varying vec2 vUv;
uniform float u_time;

void main() {
  gl_FragColor = vec4(vec3(abs(sin(u_time * 20.0 * vUv.y)),
                           abs(sin(u_time * 20.0 * vUv.y)), 0.0),
                      1.0);
}