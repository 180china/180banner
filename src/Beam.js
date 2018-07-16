const THREE = require('three');
const glslify = require('glslify');

class Beam {
  randomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  constructor() {

    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.instances = 200;
    this.obj = null;


    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const planeGeometry = new THREE.PlaneBufferGeometry(6, 6000, 1, 1);

    // Add common attributes
    geometry.addAttribute('position', planeGeometry.attributes.position);
    geometry.addAttribute('uv', planeGeometry.attributes.uv);
    geometry.setIndex(planeGeometry.index);

    // Add instance attributes
    const instancePosition = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const delay = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const h = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    for (var i = 0, ul = this.instances; i < ul; i++) {
      instancePosition.setXYZ(
        i,
        this.randomArbitrary(-2000, 2000),
        0,
        this.randomArbitrary(-200, 500),
      );
      delay.setXYZ(i, Math.random() * 2.0);
      h.setXYZ(i, Math.random() * 0.3);
    }
    geometry.addAttribute('instancePosition', instancePosition);
    geometry.addAttribute('delay', delay);
    geometry.addAttribute('h', h);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/beam.vert'),
      fragmentShader: glslify('./glsl/beam.frag'),
      depthWrite: false,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);


  }
  render(time) {
    this.uniforms.time.value += time;
  }
}


export default Beam;