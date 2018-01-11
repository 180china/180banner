"use strict";

// libs
import * as THREE from 'three';
import TweenMax from "gsap";
var glslify = require('glslify');
import OrbitContructor from 'three-orbit-controls';
var OrbitControls = OrbitContructor(THREE);
import Stats from 'stats.js';

import dat from 'dat-gui';



const Ground = require('./Ground').default;
const Node = require('./Node').default;
const Node2 = require('./Node2').default;
const FloatPoints = require('./FloatPoints').default;
const Beam = require('./Beam').default;

var That;
var clock = new THREE.Clock();

var mouseX = 0,
	mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;



class Scene {

	constructor() {
		That = this;

		this.start();
	}

	start() {
		this.stats = new Stats();
		// document.body.appendChild(this.stats.dom);

		this.camera;
		this.scene;
		this.MainObjects;

		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 50000);
		this.scene = new THREE.Scene();
		this.scene.add(this.camera);
		this.camera.target = new THREE.Vector3(0, 0, 0);
		this.camera.position.set(0, -500, 2500);
		this.camera.lookAt(this.camera.target);


		// init renderer
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			autoClearColor: true
		});
		// this.renderer.setClearColor(0x11297a);
		// this.renderer.setClearColor(0xffffff);
		// this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);

		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;


		// // controls
		// this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		// this.controls.update();


		this.scene.background = new THREE.TextureLoader().load('./assets/bg.jpg');



		document.addEventListener('mousemove', this.onDocumentMouseMove, false);

		window.addEventListener('resize', this.onWindowResize, false);
		window.addEventListener('keydown', function(e) {
			//key P  Fullscreen
			if (e.keyCode === 80) {
				var de = document.documentElement;
				if (de.requestFullscreen) {
					de.requestFullscreen();
				} else if (de.mozRequestFullScreen) {
					de.mozRequestFullScreen();
				} else if (de.webkitRequestFullScreen) {
					de.webkitRequestFullScreen();
				}
			}
			//key S Start
			if (e.keyCode === 83) {
				That.goStart();
			}
			// //key  Choose
			// if (e.keyCode === 32) {
			// 	That.Choose();
			// }

			//key E EffectAble
			if (e.keyCode === 69) {
				EffectAble = !EffectAble;
			}


			//key B back to stage
			if (e.keyCode === 66) {
				That.goStage();
			}
			// console.log(e.keyCode);
		});

		clock.start();
		this.animate();


		That.initStage();
	}


	initStage() {

		That.ground = new Ground();
		That.scene.add(That.ground.obj);
		That.ground.obj.position.set(0, -600, 0);


		That.beam = new Beam();
		That.scene.add(That.beam.obj);


		That.node = new Node();
		That.node.createObj();
		That.scene.add(That.node.obj);

		// That.node2 = new Node2();
		// That.node2.createObj();
		// That.scene.add(That.node2.obj);
		// That.node2.obj.position.set(0, 400, 1000);

		That.floatPoints = new FloatPoints();
		That.floatPoints.createObj();
		That.scene.add(That.floatPoints.obj);

	}



	onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		That.camera.aspect = window.innerWidth / window.innerHeight;
		That.camera.updateProjectionMatrix();
		That.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	onDocumentMouseMove(event) {
		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;
	}


	animate() {
		requestAnimationFrame(this.animate.bind(this));


		let deltaTime = clock.getDelta();
		this.render(deltaTime);
	}


	// main animation loop
	render(dt) {
		if (this.stats) this.stats.update();

		if (this.ground) this.ground.render(dt);
		if (this.node) this.node.render(dt);
		if (this.node2) this.node2.render(dt);
		if (this.floatPoints) this.floatPoints.render(dt);
		if (this.beam) this.beam.render(dt);



		mouseX += (0 - mouseX) * 0.01;
		mouseY += (0 - mouseY) * 0.01;
		this.camera.position.x += (mouseX - this.camera.position.x) * 0.05;
		this.camera.position.y += (-mouseY - 400 - this.camera.position.y) * 0.05;



		this.camera.lookAt(this.camera.target);
		this.renderer.render(this.scene, this.camera);

	}



}

export default Scene;