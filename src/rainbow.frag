void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.0);
    float angle = atan(coord.y - 0.5, coord.x - 0.5) * 0.1;
    float len = length(vec2(coord.x - 0.5, coord.y - 0.5));
    color.r += sin(len * 40. + angle * 40. + iTime);
    color.g += cos(len * 50. + angle * 50. - iTime);
    color.b += sin(len * 60. + angle * 60. + 3.0);
    gl_FragColor = vec4(color, 1.0);

}