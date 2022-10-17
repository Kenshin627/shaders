float circleShape(vec2 position, float radius, vec2 center) {
    return smoothstep(radius, radius + 0.003, distance(position, center));
}

void main() {
    vec2 st = gl_FragCoord.xy / iResolution.xy;
    vec3 circleColor = vec3( 0.2, 0.8, 0.4);
    vec3 baseColor = vec3(0.0, 0.0, 0.0);
    float circle = 1.0 - circleShape(st, 0.2, vec2(0.5));
    vec3 finalColor = mix(baseColor, circleColor, circle);
    gl_FragColor = vec4(finalColor, 1.0);
}