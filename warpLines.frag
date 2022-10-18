void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    float color = 0.0;
    color += sin(coord.x * 50.0 + cos(iTime + coord.y * 10. + sin(coord.x * 50. + iTime * 2.))) * 2.0;
    color += cos(coord.x * 20.0 + sin(iTime + coord.y * 10. + cos(coord.x * 50. + iTime * 2.))) * 2.0;
    color += sin(coord.x * 30.0 + cos(iTime + coord.y * 10. + sin(coord.x * 50. + iTime * 2.))) * 2.0;
    color += cos(coord.x * 10.0 + sin(iTime + coord.y * 10. + cos(coord.x * 50. + iTime * 2.))) * 2.0;
    gl_FragColor = vec4(vec3(color + coord.y, color + coord.x,color), 1.0);
}