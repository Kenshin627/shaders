float sdCircle(vec2 uv, vec2 center, float radius) {
    return smoothstep(radius, radius - 0.01, length(uv - center));
}

float smile(vec2 uv, vec2 p, float size) {
    float mask = 0.;
    uv -= p;
    uv /= size;
    float face = sdCircle(uv, vec2(0.0), 0.3);
    mask += face;
    float leftEye = sdCircle(uv, vec2(-0.1, 0.1), 0.035);
    float rightEye = sdCircle(uv, vec2(0.1, 0.1), 0.035);
    mask -= leftEye;
    mask -= rightEye;
    float mouth = sdCircle(uv, vec2(.0, -.1), 0.12);
    mouth -= sdCircle(uv, vec2(.0, -.05), 0.12);
    mask -= mouth;
    return mask;
}

void main () {
    vec2 uv = (gl_FragCoord.xy - .5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    vec3 col = vec3(0.0);

    /**
    * Smile
    **/
    vec3 faceColor = vec3(0.9882, 0.9882, 0.0588);
    float mask = smile(uv, vec2(.0, .0), .5);
    col += mask; 
    col *= faceColor;

    gl_FragColor = vec4(col, 1.0);
}