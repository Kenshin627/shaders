#define S(a, b, t) smoothstep(a, b, t)
struct Ray {
    vec3 d, o;
};

Ray getRay(vec2 uv, vec3 ro, vec3 lookAt, float zoom) {
    Ray ray;
    ray.o = ro;
    vec3 y = vec3(0.0, 1.0, 0.0);
    vec3 F = normalize(lookAt - ro);
    vec3 R = cross(y, F);
    vec3 U = cross(F, R);

    vec3 c = ro + zoom * F;
    vec3 i = c + uv.x * R + uv.y * U;
    vec3 rd = normalize(i - ro);
    ray.d = rd;
    return ray;
}

vec3 closesPoint(Ray r, vec3 p) {
    return r.o + max(0., dot(p - r.o, r.d)) * r.d;
}

//1. 计算光线与点距离第一种方式
float distRay(Ray r, vec3 p) {
    return length(p - closesPoint(r, p));
}

//2. 计算光线与点距离第二种方式
float distLine(Ray r, vec3 p) {
    return length(cross(p - r.o, r.d)) / length(r.d);
}

float drawPoint(Ray r, vec3 p) {
    float d = distLine(r, p);
    return smoothstep(0.02,0.016 , d);
}

float N(float t) {
    return fract(sin(t * 3456.) * 6547.);
}

vec4 N14(float t) {
    return fract(sin(t * vec4(123., 1678, 5432, 9812)) * vec4(981, 542, 6731, 5462));
}

float Bokeh(Ray r, vec3 p, float size, float blur) {
    float d = distRay(r, p);
    size *= length(p);
    float s = S(size, size * (1. - blur), d);
    s *= mix(0.6, 1.0, S(0.8 * size, size, d));
    return s;
}

vec3 StreetLights(Ray ray, float t) {
    float mask = .0;
    float s = 1. / 10.;
    float side = step(ray.d.x, .0);
    ray.d.x = abs(ray.d.x);
    for(float i = 0.; i < 1.; i += s){
        float ti = fract(t + i + side * s * .5);
        vec3 p = vec3(2., 2., 100. - ti * 100.);
        mask += Bokeh(ray, p, .03, .1) * ti * ti * ti;
    }
    return  vec3(1.0, 0.7, 0.3) * mask;
}

vec3 EnvirmentLights(Ray ray, float t) {
    vec3 col = vec3(.0);
    float s = 1. / 10.;
    float side = step(ray.d.x, .0);
    ray.d.x = abs(ray.d.x);
    for(float i = 0.; i < 1.; i += s){
        float ti = fract(t + i + side * s * .5);
        vec4 n = N14(i + side * 100.);
        float x = mix(2.5, 10., n.x);
        float y = mix(.1, 1.5, n.y);
        vec3 p = vec3(x, y, 50. - ti * 50.);
        float fade = ti * ti * ti;

        float occlusion = sin(ti * 6.28 * 10. * n.x) * .5 + .5;
        fade = occlusion;
        col += Bokeh(ray, p, .03, .1) * fade * vec3(n.zwy) * .5;
    }
    return col;
}

vec3 HeadLights(Ray ray, float t) {
    t *= 2.;
    float mask = .0;
    float s = 1. / 30.;
    float w1 = 0.25;
    float w2 = w1 * 1.25;
    for(float i = 0.; i < 1.; i += s){
        float n = N(i);
        if(n > .1) continue;
        float ti = fract(t + i);
        float z = 100. - ti * 100.;
        float fade = ti * ti * ti * ti * ti;
        float focus = smoothstep(0.9, 1.0, ti);
        float size = mix(0.03, 0.02, focus);

        float ref = 0.;
        mask += Bokeh(ray, vec3(-1. - w1, .15, z), size, .1) * fade;
        mask += Bokeh(ray, vec3(-1. + w1, .15, z), size, .1) * fade;

        mask += Bokeh(ray, vec3(-1. - w2, .15, z), size, .1) * fade;
        mask += Bokeh(ray, vec3(-1. + w2, .15, z), size, .1) * fade;

        ref += Bokeh(ray, vec3(-1. - w2, -.15, z), size * 3., 1.) * fade;
        ref += Bokeh(ray, vec3(-1. + w2, -.15, z), size * 3., 1.) * fade;
        ref *= focus;
        mask += ref;
    }
    return  vec3(.9, 0.9, 1.0) * mask;
}

vec3 TailLights(Ray ray, float t) {
    t *= 0.25;
    float mask = .0;
    float s = 1. / 15.;
    float w1 = 0.25;
    float w2 = w1 * 1.25;
    for(float i = 0.; i < 1.; i += s){
        float n = N(i);
        float ti = fract(t + i);
        if(n > .5) continue;
        float laneShift = S(1., .96, ti);
        float x = 1.5 - step(0.25, n) * laneShift;
        float z = 100. - ti * 100.;
        float fade = ti * ti * ti * ti * ti;
        float focus = smoothstep(0.9, 1.0, ti);
        float size = mix(0.03, 0.02, focus);

        
        float blink = step(0., sin(t * 1000.)) * 7.;
        mask += Bokeh(ray, vec3(x - w1, .15, z), size, .1) * fade;
        mask += Bokeh(ray, vec3(x + w1, .15, z), size, .1) * fade;

        mask += Bokeh(ray, vec3(x - w2, .15, z), size, .1) * fade;
        mask += Bokeh(ray, vec3(x + w2, .15, z), size, .1) * fade * (1. + blink * 1.0);

        float ref = 0.;
        ref += Bokeh(ray, vec3(x - w2, -.15, z), size * 3., 1.) * fade;
        ref += Bokeh(ray, vec3(x + w2, -.15, z), size * 3., 1.) * fade;
        ref *= focus;
        mask += ref;
    }
    return  vec3(1., 0.1, 0.03) * mask;
}

vec2 Rain(vec2 uv, float t) {
    t *= 40.;
    vec2 a = vec2(3., 1.);
    vec2 st = uv * a; 

    vec2 id = floor(st);
    st.y += t * .22;
    float n = fract(sin(id.x * 716.34) * 768.34);
    st.y += n;
    uv.y +=n;

    id = floor(st);
    st = fract(st) -.5;

    t += fract(sin(id.x * 76.34 + id.y * 1456.76) * 768.34) * 6.283;
    float y = -sin(t + sin(t + sin(t)*.5)) * .43;
    vec2 p = vec2(0., y);
    vec2 o1 = (st - p) / a;
    float d = length(o1);
    float m1 = smoothstep(0.07, 0., d);
    // if(st.x > 0.46 || st.y > 0.49){
    //     m1 = 1.;
    // }
    vec2 o2 = (fract(uv * a.x * vec2(1., 2.)) - .5) / vec2(1., 2.);
    d = length(o2);
    float m2 = smoothstep(0.3 * (.5 - st.y), 0.00, d) * smoothstep(-.1, .1, st.y - p.y);

    return vec2(m1 * o1 * 30. + m2 * o2 * 10.);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float cameraZoom = 1.5;
    vec3 ro = vec3(0., 0.2, .0);
    vec3 lookAt = vec3(0., 0.2, 1.0);
    float t = iTime * 0.05;

    vec2 rain = Rain(uv * 5., t) * .5;
    rain += Rain(uv * 7., t) * .5;

    uv.x += sin(uv.y * 70.) * .005;
    uv.y += sin(uv.x * 170.) * .002;
    Ray ray = getRay(uv - rain * .5, ro, lookAt, cameraZoom);

    vec3 col = StreetLights(ray, t);
    col += HeadLights(ray, t);
    col += TailLights(ray, t);
    col += EnvirmentLights(ray, t);
    col += (ray.d.y + .25)* vec3(.2, .1, .5);

    gl_FragColor = vec4(col, 1.0);
}