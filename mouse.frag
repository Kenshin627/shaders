void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.);
    color.r = iMouse.x / iResolution.x;
    color.g = iMouse.y / iResolution.y;
    gl_FragColor = vec4(color, 1.0);
}