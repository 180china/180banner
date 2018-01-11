const THREE = require('three');
const glslify = require('glslify');


export default class Node2 {
  constructor() {

    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      twist: {
        type: 'f',
        value: 200
      },
    };
    this.obj = null;
    this.objWire = null;
    this.objPoints = null;
  }
  radians(degree) {
    return degree * Math.PI / 180;
  }

  createObj() {
    // Define Geometry
    const geometry = new THREE.RingBufferGeometry(1800, 1600, 36, 3, this.radians(180), this.radians(180));

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/node.vert'),
      fragmentShader: glslify('./glsl/node.frag'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      flatShading: true,
    });
    const materialWire = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/node.vert'),
      fragmentShader: glslify('./glsl/nodeWire.frag'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      wireframe: true,
    });
    const materialPoints = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/nodePoints.vert'),
      fragmentShader: glslify('./glsl/nodePoints.frag'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    this.obj = new THREE.Object3D();
    this.obj.add(new THREE.Mesh(geometry, material));
    this.obj.add(new THREE.Mesh(geometry, materialWire));
    this.obj.add(new THREE.Points(geometry, materialPoints));

  }
  render(time) {
    this.uniforms.time.value += time;
    this.uniforms.twist.value = 150+Math.sin(this.uniforms.time.value * .1)*300;
    const rotation = [
      this.radians(70),
      0,
      0,
    ]
    this.obj.rotation.set(rotation[0], rotation[1], rotation[2]);
  }
}
