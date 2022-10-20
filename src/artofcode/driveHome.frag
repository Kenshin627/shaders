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

float Bokeh(Ray r, vec3 p, float size, float blur) {
    return S(blur, size, distRay(r, p));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float cameraZoom = .5;
    vec3 ro = vec3(0.0, 0.0, -2.0);
    vec3 lookAt = vec3(0.0, 0.0, 3.0);

    Ray ray = getRay(uv, ro, lookAt, cameraZoom);

    float d = .0;
    d += Bokeh(ray, vec3(.2, .2, .5), .09, .1);
    d += Bokeh(ray, vec3(0., 0., .5), .09, .1);
    gl_FragColor = vec4(vec3(d), 1.0);
}