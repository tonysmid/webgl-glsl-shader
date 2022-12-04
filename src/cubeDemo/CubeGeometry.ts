const CUBE_FACES = 6;
const VERTS_PER_FACE = 4;

export const cubeGeometryPositions = [
	0.5, 0.5, 0.5,
	0.5, 0.5, -0.5,
	0.5, -0.5, 0.5,
	0.5, -0.5, -0.5,

	-0.5, 0.5, -0.5,
	-0.5, 0.5, 0.5,
	-0.5, -0.5, -0.5,
	-0.5, -0.5, 0.5,

	-0.5, 0.5, -0.5,
	0.5, 0.5, -0.5,
	-0.5, 0.5, 0.5,
	0.5, 0.5, 0.5,

	-0.5, -0.5, 0.5,
	0.5, -0.5, 0.5,
	-0.5, -0.5, -0.5,
	0.5, -0.5, -0.5,

	-0.5, 0.5, 0.5,
	0.5, 0.5, 0.5,
	-0.5, -0.5, 0.5,
	0.5, -0.5, 0.5,

	0.5, 0.5, -0.5,
	-0.5, 0.5, -0.5,
	0.5, -0.5, -0.5,
	-0.5, -0.5, -0.5,
];

export function getCubeGeometryUVs() {
	const CUBE_FACES = 6;
	const faceUvs = [0, 1, 1, 1, 0, 0, 1, 0];
	const buffer = [];
	for (let i = 0; i < CUBE_FACES; i++) {
		buffer.push(...faceUvs);
	}

	return buffer;
}

export const cubeGeometryIndices = [
	0, 2, 1, 2, 3, 1,
	4, 6, 5, 6, 7, 5,
	8, 10, 9, 10, 11, 9,
	12, 14, 13, 14, 15, 13,
	16, 18, 17, 18, 19, 17,
	20, 22, 21, 22, 23, 21,
];

export function getCubeGeometryColorGroups() {
	const buffer = new Array(CUBE_FACES * VERTS_PER_FACE);
	const groups = [0, 0, 1, 1, 2, 2];
	groups.forEach((groupId, index) => {
		buffer.fill(groupId, index * VERTS_PER_FACE, (index+1) * VERTS_PER_FACE);
	})
	return buffer;
}