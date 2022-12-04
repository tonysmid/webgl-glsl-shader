import {BufferAttribute, BufferGeometry, DoubleSide, Mesh, ShaderMaterial} from 'three';
import vertexShader from './glsl/vertexShader.glsl?raw';
import fragmentShader from './glsl/fragmentShader.glsl?raw';
import {
	cubeGeometryIndices,
	cubeGeometryPositions,
	getCubeGeometryColorGroups,
	getCubeGeometryUVs
} from './CubeGeometry';

export enum BufferSize {
	Position = 3,
	Normal = 3,
	UV = 2,
}

const CHECKERBOARD_SIZE = 10;
const CHECKERBOARD_OPACITY_LOW = 0.2;
const CHECKERBOARD_OPACITY_HIGH = 0.8;
const CHECKERBOARD_OPACITY_INCREASE = 0.2;

export default class CubeProgram {
	private uniforms!: any;
	private mesh!: Mesh;

	private geometry!: BufferGeometry;
	private material!: ShaderMaterial;

	constructor() {
		this.createGeometry();

		this.uniforms = {
			uCheckerboardSize: {type: 'float', value: CHECKERBOARD_SIZE},
			uOpacityLow: {type: 'float', value: CHECKERBOARD_OPACITY_LOW},
			uOpacityHigh: {type: 'float', value: CHECKERBOARD_OPACITY_HIGH},
			uOpacityIncrease: {type: 'float', value: CHECKERBOARD_OPACITY_INCREASE},
		};

		const materialPlane = new ShaderMaterial({
			uniforms: this.uniforms,
			transparent: true,
			side: DoubleSide,
			vertexShader,
			fragmentShader,
		});

		this.mesh = new Mesh(this.geometry, materialPlane);
	}

	createGeometry() {
		this.geometry = new BufferGeometry();

		this.geometry.setAttribute('position', new BufferAttribute(new Float32Array(cubeGeometryPositions), BufferSize.Position));
		this.geometry.setAttribute('uv', new BufferAttribute(new Float32Array(getCubeGeometryUVs()), BufferSize.UV));
		// this.geometry.setAttribute('normal', new BufferAttribute(new Float32Array(cubeGeometryNormals), BufferSize.Normal));
		this.geometry.setAttribute('colorGroup', new BufferAttribute(new Uint16Array(getCubeGeometryColorGroups()), 1));
		this.geometry.setIndex(new BufferAttribute(new Uint16Array(cubeGeometryIndices), 1));

		debugger;
	}

	getMesh() {
		return this.mesh;
	}

	dispose() {
		this.geometry.dispose();
		this.material.dispose();
	}
}
