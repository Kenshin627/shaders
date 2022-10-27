void main() {
   vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    vec3 col = vec3(0.);
    float fork = smoothstep(0., .5, uv.y);
    float c = smoothstep(0.04 * (1. - fork * .6),0.0 ,abs(abs(uv.x) - 0.1 * fork));
    col += c;
    gl_FragColor =vec4(col, 1.);
}