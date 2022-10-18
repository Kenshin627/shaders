// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.14159265358979;
vec2 N(float angle) {
    return vec2(sin(angle), cos(angle));
}

void main() {
    vec2 st = (gl_FragCoord.xy -.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    vec2 mouse = iMouse.xy / iResolution.xy;
    vec3 col = vec3(0.);
    st *= 1.25;
    st.x = abs(st.x);
    st.y += tan((5. / 6.) * PI) * .5;
    vec2 n = N((5. / 6.) * PI);
    st -= n * max(0.0, dot(st - vec2(.5, 0.), n)) * 2.0;
    
    float angle = (2. / 3.) * PI;
    n = N(angle);

    st.x += .5;
    float scale = 1.;

    for(int i = 0; i < 7; i++){
        st *= 3.;
        scale *= 3.;
        st.x -= 1.5;
        st.x = abs(st.x);
        st.x -=.5;
        st -= n * min(0.0, dot(st, n)) * 2.0;
    }
    
	float d= length(st - vec2(clamp(st.x, -1., 1.), 0.0));
    d = smoothstep(1. / iResolution.y, 0.0, d / scale);
	col = vec3(d);
    gl_FragColor = vec4(col,1.0);
}