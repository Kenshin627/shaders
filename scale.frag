float circleShape(vec2 coord, float radius) {
    return step(radius, distance(coord, vec2(.5)));
}

mat2 scaleMatrix(vec2 scale){
    return mat2(scale.x, 0.0, 0.0, scale.y);
}

void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.0);
    vec2 scale = vec2(sin(iTime) + 2.);
    vec2 translate = vec2(0.5);
    coord = scaleMatrix(scale) * (coord - translate) + translate;
    float circle = 1.0 - circleShape(coord, 0.2);
    color = vec3(circle);
    gl_FragColor = vec4(color, 1.0);
}