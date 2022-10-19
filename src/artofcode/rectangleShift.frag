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
    
    /**
    * Rectangle
    **/
    uv *= 2.;
    float x = uv.x;
    float y = uv.y;
    
    // float a = -(x - .5) * ( x + .5);
    // float m = a * a * 4.;

    float m = sin(x * 8. + iTime) * .1;
    y += m;
    float t = x + 0.5;
    float blur = (1.0 - t) * 0.01 + t * 0.5;
    vec3 recColor = vec3(0.1216, 1.0, 0.8118);
    float recMask = rectangle(vec2(x, y), -0.5, 0.5, 0.1, -0.1, blur);
    col += recMask * recColor;
    gl_FragColor = vec4(col, 1.0);
}