
uniform float uCheckerboardSize;
uniform float uOpacityLow;
uniform float uOpacityHigh;

varying vec2 vUv;
varying vec3 vColor;
varying float vOpacityIncrease; // increase the opacity in case of mouse hover (resolved in vertex shader)

void main() {

	float opacity = 1.0;

	bool xEven = mod(vUv.x * uCheckerboardSize, 2.0) > 1.0;
	bool yEven = mod(vUv.y * uCheckerboardSize, 2.0) > 1.0;

	// XOR - either x or y is even, not both to make a dark tile
	if(xEven ^^ yEven){
		opacity = uOpacityLow;
	} else {
		opacity = uOpacityHigh;
	}

	opacity = opacity + vOpacityIncrease;

	gl_FragColor = vec4(vColor, opacity);
}