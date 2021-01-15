precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float TWO_PI = 6.28;

vec3 hsb2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.r * 3.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0,
                   0.0, 1.0);

  rgb *= 1.0 + abs(sin(u_time));

  return mix(vec3(1.0), rgb, c.g);
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;

  vec2 toCenter = vec2(0.5, 0.5) - st;

  float angle = atan(toCenter.x, toCenter.y);
  float radius = 100.0;

  TWO_PI = TWO_PI / 4.0;

  vec3 color = hsb2rgb(vec3((angle / TWO_PI) + sin(u_time) / 10.0, radius,
                            1.0)); // c.g, c.g, c.b

  gl_FragColor = vec4(color, 1.0);
}
