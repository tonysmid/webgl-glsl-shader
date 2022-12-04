import { BoxGeometry, Mesh, ShaderMaterial, Vector2 } from 'three';
import vertexShader from './glsl/vertexShader.glsl?raw';
import fragmentShader from './glsl/fragmentShader.glsl?raw';

export default class Cube {
	private uniforms!: any;
	private mesh!: Mesh;

	constructor() {
		const geometry = new BoxGeometry(1, 1, 1, 1, 1, 1);

		this.uniforms = {
			u_mouse: { type: 'v2', value: new Vector2() },
		};

		const materialPlane = new ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader,
			fragmentShader,
		});

		this.mesh = new Mesh(geometry, materialPlane);
	}

	getMesh() {
		return this.mesh;
	}
}
