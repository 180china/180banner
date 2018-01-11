const THREE = require('three');
const glslify = require('glslify');

export default class PhotoPoints {
  constructor(map) {

    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      u_texture: {
        value: map
      },
      u_size: {
        value: 8.
      }
    };
    this.num = 1024;

    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define Material
    const position = new THREE.BufferAttribute(new Float32Array(this.num * 3), 3, 1);
    const delay = new THREE.BufferAttribute(new Float32Array(this.num), 1, 1);
    const speed = new THREE.BufferAttribute(new Float32Array(this.num), 1, 1);
    for (var i = 0, ul = this.num; i < ul; i++) {
      const radian1 = this.radians(this.randomArbitrary(0, 150) - 75);
      const radian2 = this.radians(this.randomArbitrary(0, 360));
      const radius = this.randomArbitrary(600, 1000);
      const polar = this.polar(radian1, radian2, radius);
      position.setXYZ(i, polar[0], polar[1], polar[2]);
      delay.setXYZ(i, Math.random());
      speed.setXYZ(i, Math.random() * 2 + .2);
    }
    geometry.addAttribute('position', position);
    geometry.addAttribute('delay', delay);
    geometry.addAttribute('speed', speed);


    // Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/photoPoints.vert'),
      fragmentShader: glslify('./glsl/photoPoints.frag'),
      transparent: true,
      depthWrite: false,
      // blending: THREE.AdditiveBlending,
    });

    // Object3D
    this.obj = new THREE.Points(geometry, material);
  }

  render(time) {
    this.uniforms.time.value += time;
  }

  degrees(radian) {
    return radian / Math.PI * 180;
  }
  radians(degree) {
    return degree * Math.PI / 180;
  }
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  mix(x1, x2, a) {
    return x1 * (1 - a) + x2 * a;
  }
  polar(radian1, radian2, radius) {
    return [
      Math.cos(radian1) * Math.cos(radian2) * radius,
      Math.sin(radian1) * radius,
      Math.cos(radian1) * Math.sin(radian2) * radius,
    ];
  }
  randomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

}