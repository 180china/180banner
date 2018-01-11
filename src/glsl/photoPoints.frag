precision highp float;

uniform sampler2D u_texture;

varying vec3 vColor1;
varying vec3 vColor2;
varying float vOpacity;

void main() {
  vec2 resolution = gl_PointCoord * 2.0 - 1.0;
  float radius = length(resolution);

  float r1 = (1.0 - smoothstep(0.95, 1.0, radius));
  float r2 = (1.0 - smoothstep(0.75, 0.8, radius));

  vec3 color1 = vColor1 * (r1 - r2);
  vec3 color2 = vColor2 * r2;
  
  // float opacity = ((r1 - r2) * 0.25 + r2 * 0.5) * vOpacity;
  float opacity = ((r1 - r2) * 0.5 + r2) * vOpacity;
  // float opacity = r1 * vOpacity;


  vec2 puv = gl_PointCoord;
  puv.y = 1.-puv.y;
  vec4 base = texture2D(u_texture, puv);

  vec3 color = base.rgb;

  color += (color1+color2) * (1.-opacity) * 1.5;

  gl_FragColor = vec4(color, opacity);
}
