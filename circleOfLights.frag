const float PI = 3.14159265358979;
void main() {
    vec2 coord = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(0.);
    float circle = PI * 2.0;
    float radius = 0.4;
    float lightCount = 30.;
    float angle = circle / lightCount;
    vec2 center = vec2(0.5);
    coord -= center;
    vec2 position = coord;
    for(float i = 0.; i <lightCount; i++){
        position = coord + vec2(cos(i * angle) * radius, sin(i * angle) * radius);
        float distance = pow((1.0 - length(position)), 100.);
        color += vec3(distance);
    }
    gl_FragColor =vec4(color, 1.0);
}