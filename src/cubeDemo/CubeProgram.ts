import {BufferAttribute, BufferGeometry, DoubleSide, Mesh, ShaderMaterial} from 'three';
import vertexShader from './glsl/vertexShader.glsl?raw';
import fragmentShader from './glsl/fragmentShader.glsl?raw';
import {
	cubeGeometryIndices,
	cubeGeometryPositions,
	getCubeGeometryGroups,
	getCubeGeometryUVs
} from './CubeGeometry';

export enum BufferSize {
	Position = 3,
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
			uActiveGroup: {type: 'float', value: -1},
		};

		this.material = new ShaderMaterial({
			uniforms: this.uniforms,
			transparent: true,
			side: DoubleSide,
			vertexShader,
			fragmentShader,
		});

		this.mesh = new Mesh(this.geometry, this.material);
	}

	createGeometry() {
		this.geometry = new BufferGeometry();

		this.geometry.setAttribute('position', new BufferAttribute(new Float32Array(cubeGeometryPositions), BufferSize.Position));
		this.geometry.setAttribute('uv', new BufferAttribute(new Float32Array(getCubeGeometryUVs()), BufferSize.UV));
		this.geometry.setAttribute('group', new BufferAttribute(new Uint16Array(getCubeGeometryGroups()), 1));
		this.geometry.setIndex(new BufferAttribute(new Uint16Array(cubeGeometryIndices), 1));
	}

	getMesh() {
		return this.mesh;
	}

	setActiveGroup(activeGroupId: number) {
		if(activeGroupId === this.material.uniforms.uActiveGroup.value){
			return;
		}

		if(this.material){
			this.material.uniforms.uActiveGroup.value = activeGroupId;
			this.material.uniformsNeedUpdate = true;
		}
	}

	dispose() {
		this.geometry.dispose();
		this.material.dispose();
	}
}
