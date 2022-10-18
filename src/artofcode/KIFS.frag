void main() {
    vec2 coord = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec2 mouse = iMouse.xy / iResolution.xy;
    coord *= 3.;
    vec3 col = vec3(0.0);
    float angle = mouse.x * 3.1415926;
    vec2 n = vec2(sin(angle), cos(angle));
    // col += dot(coord, n);
    // col = smoothstep(0.003, 0.0, abs(col));
    coord.x = abs(coord.x);
    coord.x -= 0.5;
    coord -= n * min(0., dot(coord, n)) * 2.;
    float d = length(coord - vec2(clamp(coord.x, -1., 1.), 0.));
    col += smoothstep(0.03, 0.0, d);
    // col += d;
    col.rg += coord;
    gl_FragColor = vec4(col, 1.0);
}