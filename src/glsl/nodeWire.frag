precision highp float;

uniform float lineAlpha;

varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, lineAlpha);
}
