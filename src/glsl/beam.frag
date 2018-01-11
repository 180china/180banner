precision highp float;

uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vDelay;
varying vec3 vColor;

const float duration = 10.0;

void main() {
  float now = mod(time + vDelay * duration, duration) / duration;
  float opacityBothEnds = smoothstep(-2000.0, -1800.0, vPosition.y) * (1.0 - smoothstep(1800.0, 2000.0, vPosition.y));
  float opacity = smoothstep(0.85, 1.0, mod(vUv.y - now, 1.0));
  float _alpha = opacity * opacityBothEnds * .1;

  vec3 color = vColor;

  gl_FragColor = vec4(color, _alpha);
}
