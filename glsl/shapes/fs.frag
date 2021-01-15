precision highp float;

uniform vec2 u_resolution;

#define S(a, b, t) smoothstep(a, b, t);

vec2 TaperBox(vec2 p, float xb, float xt, float yb, float yt, float blur) {
  vec2 tb;

  tb.y = S(-blur, blur, p.y - yb);
  tb.y *= S(blur, -blur, p.y - yt);

  p.x = abs(p.x);

  float x = mix(xb, xt, (p.y - yb) / (yt - yb));
  tb.y *= S(blur, -blur, p.x - x);

  return tb;
}

void main() {
  vec2 tb;
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

  uv.y += 0.5;

  vec3 col = vec3(0.0, 0.0, 0.0);

  float blur = 0.001;
  //                xb,  xt,  yb,  yt
  tb = TaperBox(uv, 0.0, 0.2, 0.1, 0.3, blur);
  tb += TaperBox(vec2(uv.x + 0.21, uv.y), 0.1, 0.0, 0.2, 0.3, blur);
  tb += TaperBox(vec2(uv.x - 0.21, uv.y), 0.1, 0.0, 0.2, 0.3, blur);
  tb += TaperBox(vec2(uv.x + 0.21, uv.y), 0.0, 0.1, 0.09, 0.19, blur);
  tb += TaperBox(vec2(uv.x - 0.21, uv.y), 0.0, 0.1, 0.09, 0.19, blur);
  tb += TaperBox(vec2(uv.x, uv.y), 0.2, 0.0, 0.305, 0.4, blur);
  tb += TaperBox(vec2(uv.x, uv.y), 0.15, 0.15, 0.5, 0.7, 0.05);
  col += tb.y * 0.5;

  float thickness = 1.0 / u_resolution.y;
  if (abs(uv.x) < thickness)
    col.g = 1.0;
  if (abs(uv.y) < thickness)
    col.r = 1.0;

  gl_FragColor = vec4(col, 1.0);
}