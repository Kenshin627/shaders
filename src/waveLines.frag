void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.0);
    float line = sin(coord.x * 6.0 + sin(coord.y * 90. + iTime + cos(coord.x * 30. + iTime * 2.0))) * 0.5;
    color = vec3( line + coord.x, line + coord.x, line);
    gl_FragColor = vec4(color, 1.0);
}