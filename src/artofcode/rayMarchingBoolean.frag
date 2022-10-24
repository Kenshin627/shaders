#define MAX_NUMBER 100
#define MAX_DIST 100.
#define SURF_DIST 0.001

struct Ray {
    vec3 ro;
    vec3 rd;
};

mat2 Rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

float smin(float a, float b, float k) {
    float h = clamp(.5 + .5 * (b - a) / k, 0., 1.);
    return mix(b, a, h) - k * h * (1. - h);
}

//SDF

/**
* Sphere
*/
float sdSphere(vec3 p, vec3 c, float r) {
    return length(c - p) - r;
}

/**
* Capsule
*/
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 ap = p - a;
    vec3 ab = b - a;
    float t = dot(ap ,ab) / dot(ab, ab);
    t = clamp(t, 0., 1.);
    vec3 c = a + t * ab;
    vec3 cp = p - c;
    return length(cp) - r;
}

/**
* Torus
*/
float sdTorus(vec3 p, vec3 c, vec2 r) {
    vec3 p1 = p - c;
    vec2 pxz = p1.xz;
    float x = length(pxz) - r.x;
    float y = p1.y;
    return length(vec2(x, y)) - r.y;
}

/**
* Box
*/
float sdBox(vec3 p, vec3 c, vec3 s) {
    return length(max(abs(p - c) - s, 0.));
}

/**
* Cylinder
*/
float sdCylinder(vec3 p, vec3 a, vec3 b, float r) {
    vec3 ap = p - a;
    vec3 ab = b - a;
    float t = dot(ap, ab) / dot(ab, ab);
    vec3 c = a + t * ab;
    vec3 cp = p - c;
    float x = length(cp) - r;
    float y =(abs(t - .5) - .5) * length(ab);

    float e = length(max(vec2(x, y), 0.));
    float i = min(max(x, y), 0.);
    return e + i;
}

float getDist(vec3 p) {
    vec4 s = vec4(0., .5, 0., .5);
    float sd1 = sdSphere(p, vec3(0., .5, 0.), .5);
    float sd2 = sdSphere(p, vec3(.0, .5, 0.5), .5);

    float sd3 = sdSphere(p, vec3(0., .5, -1.), .5);
    float sd4 = sdSphere(p, vec3(-.5, .5, -1.), .5);

    float sd5 = sdSphere(p, vec3(2., .5, -1.), .5);
    float sd6 = sdSphere(p, vec3(1.5, .5, -1.), .5);

    float pd = p.y;
    vec3 boxPos = vec3(-2., 1., -.5);
    float bd = sdBox(p, boxPos, vec3(1.));
    float sd7 = sdSphere(p, boxPos, 1.);
    
    float substract = max(-sd1, sd2);
    float add = max(sd3, sd4);
    float sum = smin(sd5, sd6, .2);

    float sum2 = mix(sd7, bd, sin(iTime) * .5 + .5);
    float d = min(substract, pd);

    d = min(d, sum);
    d = min(d, add);
    d = min(d, sum2);
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
    vec2 da = vec2(0.001, 0.0);
    vec3 n = d - vec3(
        getDist(p - vec3(da.xyy)),
        getDist(p - vec3(da.yxy)),
        getDist(p - vec3(da.yyx))
    );
    return normalize(n);
}

float getLight(vec3 p) {
    vec3 lightpos = vec3(-2., 10., 0.);
    // lightpos.xz += vec2(sin(iTime) * 2. * 3.14, cos(iTime) * 2. * 3.14) * 2.;
    vec3 l  = normalize(lightpos - p);
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
    vec3 camPos = vec3(0., 4., -6.);
    vec3 lookAt = vec3(0., .0, 0.);
    float zoom = 1.;
    vec3 y = vec3(.0, 1., .0);
    vec3 F = normalize(lookAt - camPos);
    vec3 R = cross(y, F);
    vec3 U = cross(F, R);
    ray.ro = camPos;
    vec3 c = ray.ro + F * zoom;
    ray.rd = normalize(c + uv.x * R + uv.y * U - ray.ro); 
    float d = RayMarching(ray.ro, ray.rd);
    vec3 p = ray.ro + d * ray.rd;
    float diffuse = getLight(p);
    vec3 col = vec3(diffuse);
    col = pow(col, vec3(.4545));	// gamma correction
    gl_FragColor = vec4(col, 1.0);
}