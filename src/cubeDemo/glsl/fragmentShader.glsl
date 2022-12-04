
uniform float uCheckerboardSize;
uniform float uOpacityLow;
uniform float uOpacityHigh;
uniform float uOpacityIncrease;

varying vec2 vUv;
varying vec3 vColor;

void main() {

	float opacity = 1.0;

	bool xEven = mod(vUv.x * uCheckerboardSize / 2.0, 1.0) > 0.5;
	bool yEven = mod(vUv.y * uCheckerboardSize / 2.0, 1.0) > 0.5;

	if(xEven ^^ yEven){
		opacity = uOpacityLow;
	} else {
		opacity = uOpacityHigh;
	}

	gl_FragColor = vec4(vColor, opacity);
}