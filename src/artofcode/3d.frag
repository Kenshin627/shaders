float distLine(vec3 ro, vec3 rd, vec3 p) {
    return length(cross(p - ro, rd)) / length(rd);
}

float drawPoint(vec3 ro, vec3 rd, vec3 p) {
    float d = distLine(ro, rd, p);
    return smoothstep(0.02,0.016 , d);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    vec3 ro = vec3(.0, .0, -3.);
    vec3 rd = vec3(uv, -2.0) - ro;

    float d = .0;
    d += drawPoint(ro, rd, vec3(0., 0., 0.));
    d += drawPoint(ro, rd, vec3(0., 0., 1.));
    d += drawPoint(ro, rd, vec3(0., 1., 0.));
    d += drawPoint(ro, rd, vec3(0., 1., 1.));
    d += drawPoint(ro, rd, vec3(1., 0., 0.));
    d += drawPoint(ro, rd, vec3(1., 0., 1.));
    d += drawPoint(ro, rd, vec3(1., 1., 0.));
    d += drawPoint(ro, rd, vec3(1., 1., 1.));
    gl_FragColor = vec4(vec3(d), 1.0);
} 