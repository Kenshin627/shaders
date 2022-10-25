#define MAX_STEPS 100
#define MAX_DIST 100.
#define NEAR_DIST 0.001

struct Ray {
    vec3 ro;
    vec3 rd;
};

float sdSphere(vec3 p, vec3 c, float r) {
    return length(c - p) - r;
}

float sdPlane(vec3 p, vec3 n, float d) {
    return dot(p, normalize(n)) - d;
}

float sdBox(vec3 p, vec3 c, vec3 s)  {
    return length(max(abs(p - c) - s, 0.));
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 ap = p - a;
    vec3 ab = b - a;
    float d = dot(ap, ab) / dot(ab, ab);
    d = clamp(d, 0., 1.);
    vec3 c = a + d * ab;
    vec3 cp = p - c;
    return length(cp) - r;
}

float sdTorus(vec3 p, vec3 c, vec2 r) {
    vec3 p1 = p - c;
    float y = p1.y;
    vec2 pxz = p1.xz;
    float x = length(pxz) - r.x;
    return length(vec2(x, y)) - r.y;
}

float sdCylinder(vec3 p, vec3 a, vec3 b, float r) {
    vec3 ap = p - a;
    vec3 ab = b - a;
    float t = dot(ap, ab) / dot(ab, ab);
    vec3 c =  a + t * ab;
    vec3 cp = p - c;
    float x = length(cp) - r;
    t = (abs(t - .5) - .5);

    float y = t * length(ab);
    float e = length(max(vec2(x, y), 0.));
    float i = min(max(x, y), 0.);
    return e + i;
}

float getDist(vec3 p) {
    float sd = sdSphere(p, vec3(0., 0.5, 0.), .5);
    float sp = sdPlane(p, vec3(.0, 1., 0.), .0);
    float sbox = sdBox(p, vec3(1.5, 0.5, 0.), vec3(.5));
    float sc = sdCapsule(p, vec3(.0, .1, -2.), vec3(1.5, .1, -2.5), 0.1);
    float st = sdTorus(p, vec3(-1., .15, -1.5), vec2(.5, .15));
    float sCyl = sdCylinder(p, vec3(-1.0, .1, -3.5), vec3(.5, .1, -3.), 0.08);
    float d = min(sd, sp);
    d = min(d, sbox);
    d = min(d, sc);
    d = min(d, st);
    d = min(d, sCyl);
    return d;
}

float RayMarching(vec3 ro, vec3 rd) {
    float d0 = 0.;
    float ds = 0.;
    for(int i = 0; i < MAX_STEPS; i++){
        vec3 p = ro + d0 * rd;
        ds = getDist(p);
        d0 += ds;
        if(ds < NEAR_DIST || d0 >MAX_DIST) break;
    }
    return d0;
}

vec3 getNormal(vec3 p) {
    float d = getDist(p);
    vec2 dda = vec2(0.001, 0.0);
    vec3 n = d - vec3(
        getDist(p - vec3(dda.xyy)),
        getDist(p - vec3(dda.yxy)),
        getDist(p - vec3(dda.yyx))
    );
    return normalize(n);
}

float getLight(vec3 p) {
    vec3 lightPos = vec3(5., 10., 5.);
    lightPos.xz += vec2(sin(iTime), cos(iTime));
    vec3 l = normalize(lightPos - p);
    vec3 n = getNormal(p);
    float diffuse = clamp(dot(l, n), 0. ,1.);
    if(length(lightPos - p) > RayMarching(p + n * NEAR_DIST * 2., l)){
        diffuse *= .2;
    }
    return diffuse;
}
void main() {
    vec2 uv = (gl_FragCoord.xy - .5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    vec3 col = vec3(0.);
    Ray ray;

    // Camera
    vec3 camPos = ray.ro = vec3(0., 2., -6.);
    vec3 lookAt = vec3(0., 0., 1.);
    vec3 camUp = vec3(0., 1., 0.);
    float zoom = 1.;

    vec3 F = normalize(lookAt - camPos);
    vec3 R = cross(camUp, F);
    vec3 U = cross(F, R);

    vec3 c = camPos + F * zoom;
    ray.rd = normalize(c + uv.x * R + uv.y * U - camPos);

    //RayMarching
    float d = RayMarching(ray.ro, ray.rd);
    vec3 p = ray.ro + d * ray.rd;

    //Shading
    float diffuse = getLight(p);
    gl_FragColor = vec4(vec3(diffuse), 1.);
}