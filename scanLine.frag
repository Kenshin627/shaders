void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(1.) * 0.5;

    float size = 12.;
    float alpha = sin(floor(coord.x * size) + iTime * 4.0) + 2.0 / 2.0;

    gl_FragColor = vec4(color, alpha);
}