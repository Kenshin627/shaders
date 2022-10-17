float rectangleShape(vec2 st, float width, float height) {
    vec2 leftRight = step(vec2(0.5 - width * 0.5), st);
    vec2 topBottom = step(vec2(0.5 - height * 0.5), 1.0 - st);
    return leftRight.x * leftRight .y * topBottom.x * topBottom.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / iResolution.xy;
    vec3 baseColor = vec3(0.3882, 0.8196, 0.7843);
    vec3 rectangleColor = vec3(0.7,0.2, 0.3);
    float rectangle = rectangleShape(st, 0.3, 0.2);
    vec3 finalColor = mix(baseColor, rectangleColor, rectangle);
    gl_FragColor = vec4(finalColor, 1.0);
}