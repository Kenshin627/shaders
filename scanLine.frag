void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.0);
    gl_FragColor = vec4(color, 1.0);
}