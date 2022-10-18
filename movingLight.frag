void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.0);
    vec2 center = vec2(0.5);
    coord -= center;
    coord += vec2(cos(iTime) * 0.5, sin(iTime) * 0.5);
    float distance = length(coord);
    distance = pow(1.0-distance + abs(sin(iTime) * 0.1) , 30.);
    color = vec3(distance);
    gl_FragColor = vec4(color, 1.0);
}