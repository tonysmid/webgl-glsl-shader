

export default class FPSCounter {

	private readonly counterElement:HTMLDivElement;
	private readonly interval: number;
	private framesPerLastSecond = 0;

	constructor(containerId: string) {
		const containerCandidate = document.getElementById(containerId);
		if (!containerCandidate) throw new Error('Container for FPS counter was not found');

		// create a new div element
		this.counterElement = document.createElement("div") as HTMLDivElement;
		this.counterElement.classList.add('fps-counter');

		containerCandidate.appendChild(this.counterElement);

		this.interval = setInterval(this.readFrames, 1000);
	}

	private readFrames = () => {
		this.counterElement.innerText = `FPS: ${this.framesPerLastSecond}`;
		this.framesPerLastSecond = 0;
	}

	public countNewFrame() {
		this.framesPerLastSecond ++;
	}

	dispose() {
		clearInterval(this.interval);
	}

}