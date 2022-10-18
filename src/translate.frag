float circleShape(vec2 coord, float radius) {
    return step(radius, distance(coord, vec2(0.5)));
}

void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec2 translate = vec2(-0.2, 0.2);
    coord += translate;
    float circle = circleShape(coord, 0.3);
    vec3 color = vec3(circle);
    gl_FragColor = vec4(color, 1.0);
}