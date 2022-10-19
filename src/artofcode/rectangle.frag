float band(float t, float start, float end, float blur) {
    float step1 = smoothstep(start - blur, start + blur, t);
    float step2 = smoothstep(end + blur, end - blur, t);
    return step1 * step2;
}

float rectangle(vec2 uv, float left, float right, float top, float bottom, float blur) {
    float leftRightBand = band(uv.x, left, right, blur);
    float topBottomBand = band(uv.y, bottom, top, blur);
    return leftRightBand * topBottomBand;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    vec3 col = vec3(.0);
    uv *= 2.;
    vec3 recColor = vec3(0.1216, 1.0, 0.8118);
    float recMask = rectangle(uv, -0.5, 0.5, 0.1, -0.1, 0.01);
    col += recMask * recColor;
    gl_FragColor = vec4(col, 1.0);
}