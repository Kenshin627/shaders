float random2d(vec2 coord) {
    return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5443);
}

void main() {
    vec2 coord = gl_FragCoord.xy * 0.06;
    coord -= iTime + vec2(sin(coord.y), cos(coord.x));
    vec3 color = vec3(0.0);
    float rand01 = fract(random2d(floor(coord)) + iTime / 60.);
    float rand02 = fract(random2d(floor(coord)) + iTime / 30.);

    rand01 *= 0.4- length(fract(coord));
    gl_FragColor = vec4(rand01 * 4.0, rand02 * rand01 * 4.0, 0.0, 1.0);
}