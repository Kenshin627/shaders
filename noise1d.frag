float noise1d(float value) {
    return cos(value + cos(value * 90.0) * 100.0) * 0.5 + 0.5;
}

void main() {
    vec2 coord  = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.0);

    color.r = noise1d(iTime * 0.001);
    gl_FragColor = vec4(color, 1.0);
}