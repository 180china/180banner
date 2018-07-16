
import * as THREE from 'three';
import TweenMax from "gsap";
import OrbitContructor from 'three-orbit-controls';
import Stats from 'stats.js';
import dat from 'dat-gui';


const glslify = require('glslify');
const OrbitControls = OrbitContructor(THREE);

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

		this.container = document.getElementById( 'webglContainer' );

		this.camera;
		this.scene;
		this.MainObjects;
		this.isMobile=false;

        var winWidth=window.innerWidth,winHeight=window.innerHeight;
        this.isMobile=navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        if(this.isMobile){
            winHeight=winHeight/2;
        }

		this.camera = new THREE.PerspectiveCamera(50, winWidth / winHeight, 1, 50000);
		this.scene = new THREE.Scene();
		this.scene.add(this.camera);
		this.camera.target = new THREE.Vector3(0, 0, 0);
		this.camera.position.set(0, -500, 2500);
		this.camera.lookAt(this.camera.target);


		// init renderer
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha:true
		});
		// this.renderer.setClearColor(0xffffff,0.5);
		// this.renderer.setClearColor(0xffffff);
		// this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(winWidth,winHeight);
		this.container.appendChild(this.renderer.domElement);

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

        if (window.DeviceOrientationEvent) {
            //deviceOrientation：封装了方向传感器数据的事件，可以获取手机静止状态下的方向数据（设备的物理方向信息）。
            window.addEventListener("deviceorientation", orientationHandler, false);
        } else {
            //alert("not support deviceorientation event");
        }

        function orientationHandler(event) {
            var _z=event.alpha;//表示设备沿z轴上的旋转角度，范围为0~360。(z轴垂直于平面)
            var _x = event.beta;//表示设备在x轴上的旋转角度，范围为-180~180。它描述的是设备由前向后旋转的情况。
            var _y = event.gamma;//表示设备在y轴上的旋转角度，范围为-90~90。它描述的是设备由左向右旋转的情况。

			if(_x>=60)_x=60;
			if(_x<=-90)_x=-90;
            mouseX=-(_y/90)*window.innerWidth*3;
            mouseY=(_x/180)*window.innerHeight*2;
        }

		clock.start();
		this.animate();

		That.initStage();
	}


	initStage() {

		That.ground = new Ground();
		That.scene.add(That.ground.obj);
		That.ground.obj.position.set(0, -600, 0);


		That.floatPoints = new FloatPoints();
		That.floatPoints.createObj();
		That.scene.add(That.floatPoints.obj);
		That.floatPoints.obj.position.set(0, 0, -1200);


		That.beam = new Beam();
		That.scene.add(That.beam.obj);


		That.node = new Node();
		That.node.createObj();
		That.scene.add(That.node.obj);

		That.node2 = new Node2();
		That.node2.createObj();
		That.scene.add(That.node2.obj);
		That.node2.obj.position.set(0, 400, 1000);
	}



	onWindowResize() {

		if(this.isMobile)return;


        var winWidth=window.innerWidth,
			winHeight=window.innerHeight;
        if(this.isMobile){
            winHeight=winHeight/2;
        }
        //console.log(winWidth,winHeight);

        windowHalfX = winWidth / 2;
        windowHalfY = winHeight / 2;
		That.camera.aspect = winWidth / winHeight;
		That.camera.updateProjectionMatrix();
		That.renderer.setSize(winWidth, winHeight);
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