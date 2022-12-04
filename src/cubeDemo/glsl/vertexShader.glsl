
attribute float colorGroup;

varying vec2 vUv;
varying vec3 vColor;

const vec3 redColor = vec3(1.0, 0.0, 0.0);
const vec3 greenColor = vec3(0.0, 1.0, 0.0);
const vec3 blueColor = vec3(0.0, 0.0, 1.0);

void main() {

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	vUv = uv;

	if(colorGroup == 0.0) {
		vColor = greenColor;
	} else if(colorGroup == 1.0) {
		vColor = redColor;
	} else if(colorGroup == 2.0) {
		vColor = blueColor;
	}
}