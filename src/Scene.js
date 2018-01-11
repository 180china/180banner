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
		this.camera.position.set(0, -500, 3000);
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
		document.addEventListener('click', this.Choose, false);
		document.addEventListener('touchend', this.Choose, false);

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
		That.beam.setMap(That.getNameTexturel("180"));
		// That.scene.add(That.beam.obj);
		That.beam.obj.position.set(0, 3000, 0);



		That.node = new Node();
		That.node.createObj();
		That.scene.add(That.node.obj);
		// That.node.obj.scale.set(.4, .4, .4);

		// That.node2 = new Node2();
		// That.node2.createObj();
		// That.scene.add(That.node2.obj);
		// That.node2.obj.position.set(0, 400, 1000);

		That.floatPoints = new FloatPoints();
		That.floatPoints.createObj();
		That.scene.add(That.floatPoints.obj);





		That.goStage();

	}


	goStage() {
		That.beam.setMap(That.getNameTexturel("180"));
		
		That.showTxt();


		TweenMax.to(That.camera.position, 3, {
			// y: -500,
			z: 2500,
			ease: Cubic.easeInOut
		});


		

		TweenMax.to(That.ground.obj.position, 3, {
			y: -600,
			ease: Cubic.easeInOut
		});
		TweenMax.to(That.beam.obj.position, 3, {
			y: 0,
			ease: Cubic.easeInOut
		});


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

	getNameTexturel(txt) {
		var text = txt;
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var fontSize = 80;
		canvas.width = canvas.height = 256;

		// context.fillStyle="#fff";
		// context.fillRect(0,0,canvas.width,canvas.height*4/5);

		context.fillStyle = "#ffffff";
		context.font = fontSize + "px Arial";
		context.textAlign = "center";
		context.fillText(text, canvas.width / 2, canvas.height / 2);

		var texture = new THREE.Texture(undefined, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);
		texture.image = canvas;
		texture.needsUpdate = true;

		return texture;
	}
	getImgData(_image, _w, _h) {
		var imgCanvas = document.createElement('canvas');
		imgCanvas.style.display = "block";
		imgCanvas.id = "imgCanvas";
		document.body.appendChild(imgCanvas);
		imgCanvas.width = _w;
		imgCanvas.height = _h;
		var imgContext = imgCanvas.getContext("2d");
		imgContext.drawImage(_image, 0, 0, _w, _h, 0, 0, _w, _h);
		imgContext.restore();
		var imgData = imgContext.getImageData(0, 0, _w, _h);
		document.body.removeChild(imgCanvas);
		return imgData.data;
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
		if (this.gui) this.gui.render(dt);
		if (this.gui) this.gui.photoPlane.lookAt(this.camera.position);
		if (this.node) this.node.render(dt);
		if (this.node2) this.node2.render(dt);
		if (this.floatPoints) this.floatPoints.render(dt);
		if (this.beam) this.beam.render(dt);


		// if(ChooseAble)
		{
			var _x = mouseX;
			var _y = mouseY;
			this.camera.position.x += (_x - this.camera.position.x) * 0.05;
			this.camera.position.y += (-_y-400 - this.camera.position.y) * 0.05;
		}



		this.camera.lookAt(this.camera.target);
		this.renderer.render(this.scene, this.camera);

	}



	hideTxt()
	{
		var txt = document.getElementById("txt");
		TweenMax.to(txt, 3, {
			scale: 2,
			opacity: 0,
			ease: Strong.easeInOut,
			onComplete: function() {
				txt.style.display = "none";
			}
		});
	}
	showTxt()
	{
		var txt = document.getElementById("txt");
		txt.style.display = "block";
		TweenMax.to(txt, 4, {
			scale: 1,
			opacity: 1,
			ease: Strong.easeInOut
		});
	}

}

export default Scene;