#define S(a, b, t) smoothstep(a, b, t)
#define LAYER_MOUNT 10.

float hash21(vec2 p) {
    p = fract(p * vec2(234.45, 765.34));
    p += dot(p, p + 547.123);
    return fract(p.x * p.y);
}

float TaperBox(vec2 uv, float wb, float wt, float yb, float yt, float blur) {
    uv.x = abs(uv.x);
    float m = S(-blur, blur, yt - uv.y);
    m *= S(blur, -blur, yb - uv.y);
    float edge = (uv.y - yb) / (yt - yb);
    float w = wt * edge + (1. - edge) * wb;  
    m *= S(-blur, blur, w - uv.x);
    return m;
}

vec4 Tree(vec2 uv, vec3 col, float blur) {
    float m = TaperBox(uv, .03, .03, .0, .25, blur);
    m += TaperBox(uv, .2, .1, .25, .5, blur);
    m += TaperBox(uv, .15, .05, .5, .75, blur);
    m += TaperBox(uv, .1, .0, .75, 1., blur);

    float shadow = TaperBox(uv - vec2(.2, 0.), .1, .5, .15, .25, blur);
    shadow += TaperBox(uv + vec2(.25, 0.), .1, .5, .45, .5, blur);
    shadow += TaperBox(uv - vec2(.25, 0.), .1, .5, .7, .75, blur);
    col -= shadow * .8;
    return vec4(col, m);
}

float GetHeight(float x) {
    return sin(x * .4432) + sin(x) * .3;
}

vec4 Layer(vec2 uv, float blur) {
    vec4 col = vec4(0.);
    float id = floor(uv.x);
    float np = fract(sin(id * 245.21) * 4281.331) * 2. - 1.;
    float ns = fract(sin(id * 982.32) * 7281.332);
    col += S(blur, -blur, uv.y + GetHeight(uv.x));
    uv.x = fract(uv.x) - .5;
    vec3 tc = vec3(1.);
    float scaley = mix(.2, .8,ns);
    float y = -GetHeight(id + np * .3 + .5);
    vec4 tree = Tree((uv - vec2(np * .3, y)) * vec2(1., 1. + scaley), tc, blur);
    col = mix(col, tree, tree.a);
    return col;
}

vec4 stars(vec2 uv, float t) {
     float twinkle = dot(length(sin(uv + t)), length(cos(uv * vec2(22, 6.7) - t * 3.)));
    twinkle = sin(twinkle * 10.) * .5 + .5;
    float stars = pow(hash21(uv), 300.) * twinkle;
    return vec4(stars);
}

vec4 moon(vec2 uv, float t) {
    vec2 c = uv - vec2(.2, .2);
    float d = length(c);
    d = smoothstep(0.11, .1, d);

    vec2 c1 = uv - vec2(.26, .27);
    float d1 = length(c1);
    d1 = smoothstep(0.2, .1, d1);

    return vec4(vec3(d - d1), 1.);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float t = iTime * .3;
    vec4 col = vec4(0.);
    
    //moon
    vec4 moon = moon(uv, t);
    col += moon;

    //star
    vec4 stars = stars(uv, t);
    col += stars;
    uv.x += iTime * 0.05;

    //ground & tree
    float blur = 0.0;
    vec4 layer;
    for(float i =0.; i < 1.; i += 1. / LAYER_MOUNT){
        float scale = mix(30., 1., i);
        blur = mix(.1, .005, i);
        layer = Layer(uv * scale + vec2(t + i*100., i), blur);
        layer.rgb *= (1. - i) * vec3(.9, .9, 1.); 
        col = mix(col, layer, layer.a);
    }
    gl_FragColor = col;
}