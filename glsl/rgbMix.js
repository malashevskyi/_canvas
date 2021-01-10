const glsl = require('glslify');

export const frag = glsl(/* glsl */ `
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    float TWO_PI = 6.28;

    vec3 hsb2rgb( vec3 c ){
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0,
                        0.0,
                        1.0 );
  
        rgb *= (1.1 - cos(u_time / 2.0)) + 0.9;
        // rgb *= (1.1 - sin(u_time / 2.0)) + 0.9;
        return mix( vec3(1.0), rgb, c.y);
    }

    void main(){
        vec2 st = gl_FragCoord.xy / u_resolution.xy;

        vec2 toCenter = vec2(1.0, 0.0) - st;

        float angle = atan(toCenter.x, toCenter.y);
        float radius = length(toCenter) * 200.0;

        TWO_PI = TWO_PI / 4.0;

        vec3 color = hsb2rgb(vec3((angle / TWO_PI) + sin(u_time) / 10.0, radius, 1.0)); // c.x, c.y, c.z

        gl_FragColor = vec4(color, 1.0);
    }
`);
