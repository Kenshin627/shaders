void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.5 * sin(coord.x) + 0.5, 0.5 * sin(coord.y) + 0.5, 0.5 * sin(coord.x + coord.y) + 0.5);
    gl_FragColor = vec4(color, 1.0);
}