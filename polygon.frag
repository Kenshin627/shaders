const float PI = 3.14159265358979;
float polygonShape(vec2 position, float radius, float edges) {
    position = position * 2.0 - 1.0;
    float angle = atan(position.y, position.x);
    float slice = PI * 2.0 / edges;
    float len = length(position);
    return step(radius, cos(floor(0.5 + angle / slice) * slice - angle) * len);
}

void main() {
    vec2 st = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.0);
    float polygon = polygonShape(st, 0.3, 5.0);
    gl_FragColor = vec4(vec3(polygon), 1.0);
}