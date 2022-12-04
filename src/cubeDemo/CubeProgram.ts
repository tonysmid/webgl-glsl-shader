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

// how many tiles on the checkerboard
const CHECKERBOARD_SIZE = 10;
// dark tiles opacity
const CHECKERBOARD_OPACITY_LOW = 0.2;
// light tiles opacity
const CHECKERBOARD_OPACITY_HIGH = 0.8;
// how much to increase the opacity on hover
const CHECKERBOARD_OPACITY_INCREASE = 0.2;

export default class CubeProgram {
	private readonly uniforms!: any;
	private readonly mesh!: Mesh;

	private geometry!: BufferGeometry;
	private readonly material!: ShaderMaterial;

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

	/**
	 * Sets the active group (cube side) as uniform in the program
	 * @param activeGroupId
	 */
	setActiveGroup(activeGroupId: number) {
		if(activeGroupId === this.material.uniforms.uActiveGroup?.value){
			return;
		}
		this.material.uniforms.uActiveGroup.value = activeGroupId;
		this.material.uniformsNeedUpdate = true;
	}

	dispose() {
		this.geometry.dispose();
		this.material.dispose();
	}
}
