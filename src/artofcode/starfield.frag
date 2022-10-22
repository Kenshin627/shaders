float N21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}


float Star(vec2 uv, float flare) {
    float d = length(uv);
    float m = 0.05 / d;
    m += max(0.0, 1.0 - abs(uv.x * uv.y * 1000.)) * flare;
    uv *= Rot(3.1415 / 4.);
    m += max(0.0, 1.0 - abs(uv.x * uv.y * 1000.)) * .3 * flare;
    m *= smoothstep(.9, .1, d); 
    return m;
}

vec3 StarLayer(vec2 uv) {
    vec2 gv = fract(uv) - .5;
    vec2 id = floor(uv);
    vec3 col = vec3(0.);
    for(int y = -1; y <=1; y++) {
        for(int x = -1; x <=1; x++) {
            vec2 offs = vec2(x, y);
            
            float n = N21(id + offs);
            float size = fract(n * 323.32);
            float star = Star(gv - offs - vec2(n, fract(n * 34.)) + .5, smoothstep(.85, .9, size));
            vec3 color = sin(vec3(.2, .3, .9)*fract(n * 2345.2) * 123.2) * .5 + .5;
            color = color * vec3(1., .25, 1. + size) + vec3(.2, .2, .1) * .2;
            star *= sin(iTime * 5. + n * 8.) * .5 + .8;
            col += star * size * color;
        }
    }
    return col;
}

void main( )
{
    vec2 uv = (gl_FragCoord.xy - .5 * iResolution.xy)/iResolution.y;
    float t = iTime * .02;
    vec3 col = vec3(0.);
    
    uv *= Rot(t * 1.2);
    
    //if(gv.x > .48 || gv.y > .49) col.r = 1.;
    for(float i  = 0.; i < 1.; i += 1. / 10.) {
    float depth = fract(i + t);
        float scale = mix(20., .5, depth);
        float fade = depth * smoothstep(1., .8, depth);
        col += StarLayer(uv * scale + i * 342.12) * fade;
    }
    gl_FragColor = vec4(col,1.0);
    
}