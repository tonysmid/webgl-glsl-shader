// import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PerspectiveCamera, Scene, Clock, Vector2, WebGLRenderer } from 'three';
import Cube from './Cube';

export default class CubeDemoScene {
	private container!: HTMLElement;
	private screen!: Vector2;

	private renderer!: WebGLRenderer;
	private scene!: Scene;
	private camera!: PerspectiveCamera;

	private clock!: Clock;

	private controls!: OrbitControls;

	private cube!: Cube;

	constructor(containerId: string) {
		this.initContainer(containerId);
		this.initScene();
		this.initListeners();
	}

	initContainer(containerId: string) {
		const containerCandidate = document.getElementById(containerId);
		if (!containerCandidate) throw new Error('Container not found');
		this.container = containerCandidate;
		this.screen = new Vector2(this.container.clientWidth, this.container.clientHeight);
	}

	initScene() {
		this.scene = new Scene();
		this.clock = new Clock();

		this.initCamera();
		this.initRenderer();
		this.initOrbitControls();

		this.cube = new Cube();
		this.scene.add(this.cube.getMesh());

		// Init animation
		this.runLoop();
	}

	initCamera() {
		this.camera = new PerspectiveCamera(75, this.screen.x / this.screen.y, 0.1, 100);
		this.camera.position.set(-0.7, 0.8, 3);
	}

	initRenderer() {
		this.renderer = new WebGLRenderer({
			alpha: true,
			antialias: true,
		});

		this.container.appendChild(this.renderer.domElement);

		this.renderer.setSize(this.screen.x, this.screen.y);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setClearColor(0x121212);
	}

	initOrbitControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
	}

	initListeners() {
		window.addEventListener('resize', this.onResize);
		this.onResize();
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	onResize = () => {
		this.screen.set(this.container.clientWidth, this.container.clientHeight);

		this.camera.aspect = this.screen.x / this.screen.y;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.screen.x, this.screen.y);

		this.renderer.render(this.scene, this.camera);

		this.render();
	};

	runLoop() {
		requestAnimationFrame(() => {
			this.runLoop();
		});

		if (this.controls) this.controls.update();

		this.animateCubeRotation();

		this.render();
	}

	animateCubeRotation() {
		const elapsed = this.clock.getElapsedTime();
		this.cube.getMesh().rotation.y = elapsed;
	}

	destroy() {
		this.renderer.dispose();
		window.removeEventListener('resize', this.onResize);
	}
}
