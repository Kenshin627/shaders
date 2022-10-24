#define MAX_NUMBER 100
#define MAX_DIST 180.
#define SURF_DIST 0.01

struct Ray {
    vec3 ro;
    vec3 rd;
};

float distLine(Ray ray, vec3 p) {
    return length(cross(p - ray.ro, ray.rd)) / length(ray.rd);
}

float drawPoint(Ray ray, vec3 p) {
    float d = distLine(ray, p);
    return smoothstep(0.002, 0.001, d);
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 ap = p - a;
    vec3 ab = b - a;
    float t = clamp(dot(ap, ab) / dot(ab, ab), 0., 1.);
    vec3 c = a + t * ab;
    vec3 d = p - c;
    return length(d) - r;
}

float sdTorus(vec3 p, vec2 r, vec3 c) {
    vec3 p1 = p - c;
    vec3 c1 = vec3(0., 0., 0.);
    vec2 pxz = p1.xz;
    float x = length(pxz) - r.x;
    float y = p1.y;
    float d = length(vec2(x, y));
    return  d - r.y;
}

float sdBox(vec3 p, vec3 c, vec3 s) {
    vec3 p1 = p - c;
    return length(max(abs(p1) - s, 0.));
}

float sdCylinder(vec3 p, vec3 a, vec3 b, float r) {
    vec3 ap = p - a;
    vec3 ab = b- a;
    float t = dot(ap, ab) / dot(ab, ab);
    vec3 c  = a + t * ab;
    float d = length(p - c) - r;
    t = abs(t - .5) - .5;
    float y = t * length(ab);
    float e = length(max(vec2(d, y), 0.));
    float i = min(max(d, y), 0.);
    return e + i;
}

float getDist(vec3 p) {
    vec4 s = vec4(-5., 1., 6., 1.);
    float sd = length(s.xyz - p) - s.w;
    float pd = p.y;
    float cd = sdCapsule(p, vec3(2., 1., 6.), vec3(2., 2., 6.), .2);
    float td = sdTorus(p, vec2(1.5, .3), vec3(0., .5, 6.));
    float bd = sdBox(p, vec3(3., 1., 6.), vec3(.5));
    float cld = sdCylinder(p, vec3(5., 1., 6.), vec3(5., 2., 6.), .3);
    float d = min(sd, pd);
    d = min(d, cd);
    d = min(d, td);
    d = min(d, bd);
    d = min(d, cld);
    return d;
}

float RayMarching(vec3 ro, vec3 rd) { 
    float d = 0.;
    float ds = 0.;
    for(int i = 0; i < MAX_NUMBER; i++){
        vec3 p = ro + d * rd;
        ds = getDist(p);
        d += ds;
        if(ds < SURF_DIST || d > MAX_DIST) break;
    }
    return d;
}

vec3 getNormal(vec3 p) {
    float d = getDist(p);
    vec2 da = vec2(0.01, 0.0);
    vec3 n = d - vec3(
        getDist(p - vec3(da.xyy)),
        getDist(p - vec3(da.yxy)),
        getDist(p - vec3(da.yyx))
    );
    return normalize(n);
}

float getLight(vec3 p) {
    vec3 lightpos = vec3(0., 5., 6.);
    lightpos.xz += vec2(sin(iTime), cos(iTime));
    vec3 l  = lightpos - p;
    vec3 n = getNormal(p);
    float diffuse = clamp(dot(n, l),0. ,1.);
    float d = RayMarching(p + n * SURF_DIST * 2., l);
    if(d < length(lightpos - p)){
        diffuse *= 0.1;
    }
    return diffuse;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    Ray ray;
    vec3 camPos = vec3(0., 2., -2.);
    vec3 lookAt = vec3(0., 1., 1.);
    float zoom = .5;
    vec3 y = vec3(.0, 1., .0);
    vec3 F = normalize(lookAt - camPos);
    vec3 R = cross(y, F);
    vec3 U = cross(F, R);
    ray.ro = camPos;
    vec3 c = ray.ro + F * zoom;
    ray.rd = c + uv.x * R + uv.y * U - ray.ro;
    // ray.rd = vec3(uv.x, uv.y, 1.);

    float d = RayMarching(ray.ro, ray.rd);
    
    vec3 p = ray.ro + d * ray.rd;
    float diffuse = getLight(p);
    gl_FragColor = vec4(vec3(diffuse), 1.0);
}