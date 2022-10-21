vec2 N12(float t) {
    float x = fract(sin(t * 487.28) * 899.01);
    float y = fract(sin((x + t) * 982.12) * 9881.2);
    return (vec2(x, y));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x , iResolution.y);
    uv.x = abs(uv.x);
    float amount = 10.;
    float d = 0.;
    float intensity = 0.02;

    for(float i = 1.; i <= amount; i++){
        vec2 dir = N12(i) - .5;
        float t = fract(iTime);
        vec2 st = uv - dir * t * .5;
        d += 0.02 / smoothstep(0.001, 0.05, length(st));
    }
    gl_FragColor = vec4(vec3(d, 0., 0.), 1.0);
}