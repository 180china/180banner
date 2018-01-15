const THREE = require('three');
const glslify = require('glslify');


export default class Node {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      twist: {
        type: 'f',
        value: 1500
      },
      lineAlpha: {
        type: 'f',
        value: 0.02
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
    const geometry = new THREE.SphereBufferGeometry(3000, 64, 32);

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
    const rotation = [
      this.radians((this.uniforms.time.value+Math.sin(this.uniforms.time.value * .2)*0.5) * 6 +180),
      this.radians(Math.sin(this.uniforms.time.value * .05) * 60 + 180),
      0,
    ]
    this.obj.rotation.set(rotation[0], rotation[1], rotation[2]);
  }
}
