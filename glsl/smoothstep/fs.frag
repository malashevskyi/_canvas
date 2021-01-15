precision highp float;

uniform vec2 u_resolution;

#define S(a, b, t) smoothstep(a, b, t);

vec2 TaperBox(vec2 p, float xb, float xt, float yb, float yt, float blur) {
  vec2 tb;

  tb.y = S(-blur, blur, p.y - yb);
  tb.y *= S(blur, -blur, p.y - yt);

  tb.x = S(-blur, blur, p.x - xb);
  tb.x *= S(blur, -blur, p.x - xt);

  return tb;
}

void main() {
  vec2 tb;
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

  vec3 col = vec3(0.0, 0.0, 0.0);

  float xb = 0.1;
  float xt = 0.3;
  float yb = 0.1;
  float yt = 0.3;
  float blur = 0.001;

  tb = TaperBox(uv, xb, xt, yb, yt, blur);
  col += tb.y * 0.5;
  col += tb.x * 0.5;

  float thickness = 1.0 / u_resolution.y;
  if (abs(uv.x) < thickness)
    col.g = 1.0;
  if (abs(uv.y) < thickness)
    col.r = 1.0;

  gl_FragColor = vec4(col, 1.0);
}