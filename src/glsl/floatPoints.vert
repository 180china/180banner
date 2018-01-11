attribute vec3 position;
attribute float delay;
attribute float speed;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vColor1;
varying vec3 vColor2;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(./glsl-util/convertHsvToRgb);
#pragma glslify: computeRotateMat = require(./glsl-matrix/computeRotateMat);

const float duration = 3.0;

void main() {
  float now = mod(time + delay * duration, duration) / duration;
  float size = 6.0 * sin(now * 4.0);
  float blink = max(sin(now * 4.0) * 2.0 - 1.0, 0.0);
  vec3 hsv1 = vec3(time * 0.1, 0.6, 1.0);
  vec3 rgb1 = convertHsvToRgb(hsv1);
  vec3 hsv2 = vec3(time * 0.1 + 0.2, 0.6, 1.0);
  vec3 rgb2 = convertHsvToRgb(hsv2);

  mat4 rotateMat = computeRotateMat(
    radians(time * speed * 0.6),
    radians(time * speed * 0.3),
    radians(time * speed )
    );
  vec4 mvPosition = modelViewMatrix * rotateMat * vec4(position, 1.0);
  float lengthToCamera = 1000.0 / length(mvPosition.xyz);

  vColor1 = rgb1;
  vColor2 = rgb2;
  vOpacity = blink * clamp(lengthToCamera, 0.1, 0.8);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = lengthToCamera * size;
}
