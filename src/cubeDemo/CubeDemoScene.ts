import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PerspectiveCamera, Scene, Clock, Vector2, WebGLRenderer, Raycaster } from 'three';
import CubeProgram from './CubeProgram';
import { cubeGeometryIndexToGroup } from './CubeGeometry';
import FPSCounter from './FPSCounter';

/**
 * Main class to run the cube demo
 *
 * Sets up the THREE scene, renderer, interactions and fps counter
 * Uses the CubeProgram to add the interactive cube into the scene.
 */
export default class CubeDemoScene {
	private container: HTMLElement;
	private screen: Vector2;

	private renderer: WebGLRenderer;
	private scene: Scene;
	private camera: PerspectiveCamera;

	private clock: Clock;
	private counter: FPSCounter;

	private controls: OrbitControls;
	private pointer = new Vector2();
	private raycaster = new Raycaster();

	private cube!: CubeProgram;

	constructor(containerId: string) {
		this.initContainer(containerId);
		this.initScene();
		this.initListeners();
	}

	/**
	 * Tries to find the DOM element where this demo scene should run and reads sides ratio
	 * @param containerId id of the root element
	 */
	initContainer(containerId: string) {
		const containerCandidate = document.getElementById(containerId);
		if (!containerCandidate) throw new Error('Container not found');
		this.container = containerCandidate;
		this.screen = new Vector2(this.container.clientWidth, this.container.clientHeight);
	}

	/**
	 * Prepares Three scene
	 */
	initScene() {
		this.scene = new Scene();
		this.clock = new Clock();

		this.initCamera();
		this.initRenderer();
		this.initOrbitControls();
		this.initCounter();

		// initialize the cube
		this.cube = new CubeProgram();
		this.scene.add(this.cube.getMesh());

		// Init animation
		this.runLoop();
	}

	initCounter() {
		this.counter = new FPSCounter('app');
	}

	initCamera() {
		this.camera = new PerspectiveCamera(75, this.screen.x / this.screen.y, 0.1, 100);
		this.camera.position.set(0, 0.8, 3);
	}

	initRenderer() {
		this.renderer = new WebGLRenderer({
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
		window.addEventListener('pointermove', this.onPointerMove);

		// run for the first time to initialize the sizes and aspect ratio for the camera
		this.onResize();
	}

	render() {
		this.counter.countNewFrame();
		this.renderer.render(this.scene, this.camera);
	}

	onResize = () => {
		// read new container dimensions
		this.screen.set(this.container.clientWidth, this.container.clientHeight);

		// set camera
		this.camera.aspect = this.screen.x / this.screen.y;
		this.camera.updateProjectionMatrix();

		// set renderer size
		this.renderer.setSize(this.screen.x, this.screen.y);

		this.render();
	};

	// based on raycaster example https://threejs.org/docs/?q=rayca#api/en/core/Raycaster
	onPointerMove = (event: MouseEvent) => {
		// calculate pointer position in normalized device coordinates
		// (-1 to +1) for both components
		this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	};

	runLoop() {
		requestAnimationFrame(() => {
			this.runLoop();
		});

		if (this.controls) this.controls.update();
		this.rayCast();

		this.animateCubeRotation();
		this.render();
	}

	rayCast() {
		// update the picking ray with the camera and pointer position
		this.raycaster.setFromCamera(this.pointer, this.camera);

		// calculate objects intersecting the picking ray
		const intersects = this.raycaster.intersectObjects(this.scene.children);

		// no intersections with the cube
		if (!intersects.length) {
			this.cube.setActiveGroup(-1);
			return;
		}
		this.cube.setActiveGroup(cubeGeometryIndexToGroup(intersects[0].face.a));
	}

	/**
	 * Rotates the cube based on the elapsed time
	 * so that the rotation angle is independent on the FPS
	 */
	animateCubeRotation() {
		const elapsed = this.clock.getElapsedTime();
		this.cube.getMesh().rotation.y = elapsed;
	}

	/**
	 * When finished with the demo scene\
	 * use this method to clear the resources
	 */
	dispose() {
		this.cube.dispose();
		this.renderer.dispose();
		this.counter.dispose();
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener('pointermove', this.onPointerMove);
	}
}
