const THREE = require('three');
const glslify = require('glslify');


export default class Node {
  constructor() {

    this.twist = 700;
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      alpha: {
        type: 'f',
        value: .7
      },
      twist: {
        type: 'f',
        value: this.twist
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
    const geometry = new THREE.SphereBufferGeometry(3000, 32, 32);

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
    this.uniforms.twist.value = this.twist;
    const rotation = [
      this.radians(Math.sin(this.uniforms.time.value * 0.1) * 100),
      this.radians(Math.sin(this.uniforms.time.value * 0.01) * 20 + 90),
      0,
    ]
    this.obj.rotation.set(rotation[0], rotation[1], rotation[2]);
  }
}
