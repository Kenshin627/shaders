#define NUM_EXPLOSIONS 10.
#define NUM_PARTICLES 100.
#define PI 3.14159265358979

vec2 N12(float t) {
    float x = fract(sin(t * 674.3) * 453.2);
    float y = fract(sin((x + t) * 714.3) * 263.2);
    return (vec2(x, y));
}

vec2 N12_polar(float t) {
    float theta = fract(sin(t * 674.3) * 453.2) * PI * 2.;
    float radius = fract(sin((theta + t) * 714.3) * 263.2);
    return vec2(cos(theta), sin(theta)) * radius;
}

float Explosion(vec2 uv, float t) {
    float sparks = 0.;
    for(float i = 1.; i <= NUM_PARTICLES; i++){
        vec2 dir = N12_polar(i) * .5;
        vec2 st = uv - dir * t;
        float brightness = mix(.0005, .001, smoothstep(.1, 0., t));
        brightness *= sin(t * 20. + i) * .5 + .5;
        brightness *= smoothstep(1., .5, t);
        sparks += brightness / length(uv - dir * t);
    }
    return sparks;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x , iResolution.y);
    vec3 col = vec3(.0);
    for(float i = 1.; i <= NUM_EXPLOSIONS ; i++){
        float t = iTime + i / NUM_EXPLOSIONS;
        float ft = floor(t);
        vec2 offs = N12(i + ft) - .5;
        offs *= vec2(1.77, 1.);
        vec3 color = sin(4. * vec3(.34, .54, .43) * ft) * .25 + .75;
        col += Explosion(uv - offs, fract(t)) * color;
    }
    gl_FragColor = vec4(col, 1.0);
}