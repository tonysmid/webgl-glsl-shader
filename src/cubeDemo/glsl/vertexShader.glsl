
uniform float uOpacityIncrease;
uniform float uActiveGroup;

attribute float group;

varying vec2 vUv;
varying vec3 vColor;
varying float vOpacityIncrease;

const vec3 redColor = vec3(1.0, 0.0, 0.0);
const vec3 greenColor = vec3(0.0, 1.0, 0.0);
const vec3 blueColor = vec3(0.0, 0.0, 1.0);

void main() {

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	vUv = uv;

	int colorGroup = int(group) % 3;

	if(colorGroup == 0) {
		vColor = greenColor;
	} else if(colorGroup == 1) {
		vColor = redColor;
	} else if(colorGroup == 2) {
		vColor = blueColor;
	}

	if(int(uActiveGroup) == int(group)) {
		vOpacityIncrease = 0.2;
	} else {
		vOpacityIncrease = 0.0;
	}
}