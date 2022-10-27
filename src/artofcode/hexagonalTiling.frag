float HexDist(vec2 p) {
    p = abs(p);
    float c = dot(p, normalize(vec2(1., 1.73)));
    c = max(c, p.x);
    return c;
}

vec4 HexCoords(vec2 uv) {
    vec2 r = vec2(1., 1.73);
    vec2 h = r * .5;
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv - h, r) - h;

    vec2 gv = dot(a, a) < dot(b,b) ? a : b;
    vec2 id = uv - gv;
    float x = atan(gv.x, gv.y);
    float y = .5 - HexDist(gv);
    return vec4(x, y, id.xy);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    vec3 col = vec3(0.);
    uv  *= 20.;
    vec4 hc = HexCoords(uv);
    float c = smoothstep(0.05, .1, hc.y * sin(hc.z * hc.w + iTime));
    col += c;
    gl_FragColor = vec4(vec3(col), 1.0);
    
}