mat2 rotate(float angle){
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float rectShape(vec2 coord, float width, float height) {
    vec2 edges = vec2(0.5 - width * 0.5, 0.5 - height * 0.5);
    vec2 leftBottom = step(edges, coord);
    vec2 rightTop = step(edges, vec2(1.0) - coord);
    return leftBottom.x * leftBottom.y * rightTop.x * rightTop.y;
}

void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.0);
    vec2 translate = vec2(0.5);
    coord = rotate(cos(iTime) * 4.0) * (coord - translate) + translate;
    float r = rectShape(coord, 0.5, 0.2);
    color = vec3(r);
    gl_FragColor = vec4(color, 1.0);
}