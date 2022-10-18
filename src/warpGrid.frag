void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.0);
    color += sin(coord.x * cos(iTime / 30.0) * 60.0) + sin(coord.y * cos(iTime / 15.0) * 10.);
    gl_FragColor = vec4(color, 1.0); 
}