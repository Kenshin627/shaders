#define S(a, b, t) smoothstep(a, b, t)
#define sat(x) clamp(x, 0.0, 1.0)

float sdCircle(vec2 uv, vec2 center, float radius) {
    return smoothstep(radius, radius - 0.01, length(uv - center));
}

float remap(float a, float b, float t) {
    return sat((t- a) / (b - a));
}

float remap01(float a, float b, float c, float d, float t) {
    return sat((t - a) / (b - a)) * (d - c)  + c;
}

vec2 within(vec2 uv, vec4 rect) {
    return (uv.xy - rect.xy) / (rect.zw - rect.xy);
}

vec4 Head(vec2 uv) {
    vec4 col = vec4(.9, .65, .1, 1.);
    float d = length(uv);
    col.a = S(0.5, 0.49, d);

    float edgeShade = remap(0.35, 0.5, d);
    edgeShade *= edgeShade;
    col *= (1.0 - edgeShade * .5);

    //edge
    col.rgb = mix(col.rgb, vec3(.6, .3, .1), S(.47, .48, d));

    //highLight
    float highLight = S(.41, .405, d);
    highLight *= remap01(.41, -.1, .75, 0.0, uv.y);
    col.rgb = mix(col.rgb, vec3(1.), highLight);

    //cheek
    vec2 cheekPostion = vec2(0.23, -0.23);
    uv -= cheekPostion;
    float cheek = S(.2, .08, length(uv)) * .4;
    col.rgb = mix(col.rgb, vec3(1., .1, .1), cheek);
    return col;
}

vec4 Eye(vec2 uv) {
    uv -= .5;
    vec4 col = vec4(1.0);
    float d = length(uv);

    vec4 irisCol = vec4(.1, .7, 1., 1.);

    col = mix(col, irisCol, S(.1, .7, d * .7));

    col.rgb *= 1. - S(.45, .5, d) * .5 * sat(-uv.y -uv.x);
    col = mix(col, vec4(0.), S(.3, .21, d));
    irisCol.rgb *= 1. + S(.3, .05, d);
    col = mix(col, irisCol, S(.20, .19, d));

    col.rgb = mix(col.rgb, vec3(.0), S(.16, .14, d));

    float highLight = S(.1, .09, length(uv - vec2(-.15, .15)));
    highLight += S(.07, .05, length(uv - vec2(.15, -.15)));
    col.rgb = mix(col.rgb, vec3(1.), highLight);

    col.a = S(.5, .48, d);
    return col;
}

vec4 Mouth(vec2 uv) {
    uv -=.5;
    uv.y -= uv.x * uv.x;
    vec4 col = vec4(.5, .18, .05, 1.0);
    float d= length(uv);
    col.a = S(.5, .48, d);

    float td = length(uv - vec2(0.0, 0.6));
    vec3 toothCol = vec3(1.) * S(.6, .35, d);
    col.rgb = mix(col.rgb, toothCol, S(.4, .37, td));

    td = length(uv - vec2(0., -.5));
    col.rgb = mix(col.rgb, vec3(1., .5, .5), S(.5, .2, td));
    return col;
}

vec4 smiley(vec2 uv) {
    vec4 col = vec4(0.);
    uv.x = abs(uv.x);
    vec4 head = Head(uv);
    vec4 eye = Eye(within(uv, vec4(.03, -.1, .37, .25)));
    vec4 mouth = Mouth(within(uv, vec4(-.3, -.4, .3, -.1 )));
    col = mix(col, head, head.a);
    col = mix(col, eye, eye.a);
    col = mix(col, mouth, mouth.a);
    return col;
}

void main() {
    vec2 uv  = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    uv *= 2.;
    gl_FragColor = smiley(uv);
}