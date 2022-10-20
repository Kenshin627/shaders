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
        if(n > .5) continue;
        float x = 1.5 - step(0.25, n);
        float ti = fract(t + i);
        float z = 100. - ti * 100.;
        float fade = ti * ti * ti * ti * ti;
        float focus = smoothstep(0.9, 1.0, ti);
        float size = mix(0.03, 0.02, focus);

        float ref = 0.;

        mask += Bokeh(ray, vec3(x - w1, .15, z), size, .1) * fade;
        mask += Bokeh(ray, vec3(x + w1, .15, z), size, .1) * fade;

        mask += Bokeh(ray, vec3(x - w2, .15, z), size, .1) * fade;
        mask += Bokeh(ray, vec3(x + w2, .15, z), size, .1) * fade;

        ref += Bokeh(ray, vec3(x - w2, -.15, z), size * 3., 1.) * fade;
        ref += Bokeh(ray, vec3(x + w2, -.15, z), size * 3., 1.) * fade;
        ref *= focus;
        mask += ref;
    }
    return  vec3(0.7922, 0.2, 0.098) * mask;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float cameraZoom = 1.5;
    vec3 ro = vec3(0.0, 0.2, .0);
    vec3 lookAt = vec3(0.0, 0.2, 1.0);

    Ray ray = getRay(uv, ro, lookAt, cameraZoom);
    float t = iTime * 0.1;

    vec3 col = StreetLights(ray, t);
    col += HeadLights(ray, t);
    col += TailLights(ray, t);
    gl_FragColor = vec4(col, 1.0);
}