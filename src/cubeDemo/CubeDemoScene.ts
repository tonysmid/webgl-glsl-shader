// import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {PerspectiveCamera, Scene, Clock, Vector2, WebGLRenderer, Raycaster} from 'three';
import CubeProgram from './CubeProgram';
import {cubeGeometryIndexToGroup} from "./CubeGeometry";

export default class CubeDemoScene {
	private container!: HTMLElement;
	private screen!: Vector2;

	private renderer!: WebGLRenderer;
	private scene!: Scene;
	private camera!: PerspectiveCamera;

	private clock!: Clock;

	private controls!: OrbitControls;
	private pointer = new Vector2();
	private raycaster = new Raycaster();

	private cube!: CubeProgram;

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

		this.cube = new CubeProgram();
		this.scene.add(this.cube.getMesh());

		// Init animation
		this.runLoop();
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
		window.addEventListener( 'pointermove', this.onPointerMove );

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

	onPointerMove = (event: MouseEvent) => {
			// calculate pointer position in normalized device coordinates
			// (-1 to +1) for both components
			this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}

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
		this.raycaster.setFromCamera( this.pointer, this.camera );

		// calculate objects intersecting the picking ray
		const intersects = this.raycaster.intersectObjects( this.scene.children );

		if(!intersects.length){
			this.cube.setActiveGroup(-1);
			return;
		}
		this.cube.setActiveGroup(cubeGeometryIndexToGroup(intersects[0].face.a));
	}

	animateCubeRotation() {
		const elapsed = this.clock.getElapsedTime();
		this.cube.getMesh().rotation.y = elapsed;
	}

	dispose() {
		this.cube.dispose();
		this.renderer.dispose();
		window.removeEventListener('resize', this.onResize);
		window.removeEventListener( 'pointermove', this.onPointerMove );
	}
}
