float circleShape(vec2 coord, float radius) {
    return step(radius, distance(coord, vec2(.5)));
}

void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.0);
    vec2 translate = vec2(sin(iTime), cos(iTime));
    coord += translate * 0.5;
    float circle = circleShape(coord, 0.1);
    color = vec3(circle);
    gl_FragColor = vec4(color, 1.0);
}