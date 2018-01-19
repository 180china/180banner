const THREE = require('three');
const glslify = require('glslify');


export default class Ground {
  constructor() {

    const texture1 = new THREE.TextureLoader().load('./assets/height.jpg');
    // const texture1 = new THREE.TextureLoader().load("/Public/src/img/home/height.jpg");

    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;

    this.uniforms = {
      u_time: {
        value: 0.0
      },
      u_texture: {
        value: texture1
      }
    };

    // Geometry
    const geometry = new THREE.PlaneBufferGeometry(2600, 3600, 128, 128);
    geometry.rotateX(-Math.PI / 2);

    // Material
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/ground.vert'),
      fragmentShader: glslify('./glsl/ground.frag'),
      depthWrite: false,
      transparent: true,
      // blending: THREE.AdditiveBlending,
      wireframe: true,
    });

    // Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }

  render(time) {
    this.uniforms.u_time.value += time;
  }
}