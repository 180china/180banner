const THREE = require('three');
const glslify = require('glslify');


export default class GUI {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texture1: {
        type: 't',
        value: null
      },
      texture2: {
        type: 't',
        value: null
      },
      texture3: {
        type: 't',
        value: null
      },
      photo: {
        type: 't',
        value: null
      },
    };
    this.photoUniforms = {
      time: {
        type: 'f',
        value: 0
      },
      photo: {
        type: 't',
        value: null
      },
      photoMask: {
        type: 't',
        value: null
      },
    };

    this.num = 5;
    this.obj = null;
    this.photoPlane = null;
    this.otherPlanes = null;
  }
  createObj(textures, photo) {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 2, 2);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.addAttribute('normal', baseGeometry.attributes.normal);
    geometry.addAttribute('uv', baseGeometry.attributes.uv);
    geometry.setIndex(baseGeometry.index);

    // Define attributes of the instancing geometry
    const instancePosition = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, 1);
    const rotate1 = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    const rotate2 = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    const rotate3 = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    const h = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    for (let i = 0, ul = this.num; i < ul; i++) {
      instancePosition.setXYZ(i, 0, 0, (this.num - i) * -100);
      rotate1.setXYZ(i, Math.random() * 2 - 1);
      rotate2.setXYZ(i, Math.random() * 2 - 1);
      rotate3.setXYZ(i, Math.random() * 2 - 1);
      h.setXYZ(i, (Math.random() * 2 - 1) * 0.15);
    }
    geometry.addAttribute('instancePosition', instancePosition);
    geometry.addAttribute('rotate1', rotate1);
    geometry.addAttribute('rotate2', rotate2);
    geometry.addAttribute('rotate3', rotate3);
    geometry.addAttribute('h', h);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/gui.vert'),
      fragmentShader: glslify('./glsl/gui.frag'),
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    this.uniforms.texture1.value = textures[0];
    this.uniforms.texture2.value = textures[1];
    this.uniforms.texture3.value = textures[2];
    this.uniforms.photo.value = photo;

    // Create 
    this.otherPlanes = new THREE.Mesh(geometry, material);


    //Photo
    const photoGeometry = new THREE.PlaneBufferGeometry(350, 350, 2, 2);
    const photoMaterial = new THREE.RawShaderMaterial({
      uniforms: this.photoUniforms,
      vertexShader: glslify('./glsl/guiPhoto.vert'),
      fragmentShader: glslify('./glsl/guiPhoto.frag'),
      transparent: true,
      // blending: THREE.AdditiveBlending,
    });
    this.photoUniforms.photo.value = photo;
    this.photoUniforms.photoMask.value = textures[3];

    this.photoPlane = new THREE.Mesh(photoGeometry, photoMaterial);


    this.obj = new THREE.Object3D();
    this.obj.add(this.otherPlanes);
    this.obj.add(this.photoPlane);
    this.photoPlane.position.z= -300;
 
  }

  setPhoto(_tex) {
    this.uniforms.photo.value = _tex;
    this.photoUniforms.photo.value = _tex;
  }

  render(time) {
    this.uniforms.time.value += time;
    this.photoUniforms.time.value += time;
  }
}