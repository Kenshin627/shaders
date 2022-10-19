float sdCircle(vec2 uv, vec2 center, float radius) {
    return smoothstep(radius, radius - 0.01, length(uv - center));
}

void main () {
    vec2 uv = (gl_FragCoord.xy - .5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    vec3 col = vec3(0.0);

    vec3 faceColor = vec3(0.9882, 0.9882, 0.0588);
    float face = sdCircle(uv, vec2(0.0), 0.3);
    col += face ;

    float leftEye = sdCircle(uv, vec2(-0.1, 0.1), 0.035);
    float rightEye = sdCircle(uv, vec2(0.1, 0.1), 0.035);
    col -= leftEye;
    col -= rightEye;

    float mouth = sdCircle(uv, vec2(.0, -.1), 0.12);
    mouth -= sdCircle(uv, vec2(.0, -.05), 0.12);
    
    col -= mouth;

    col *= faceColor;
    gl_FragColor = vec4(col, 1.0);
}