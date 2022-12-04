/**
 * Simple class to count and display frames
 */
export default class FPSCounter {

	private readonly counterElement:HTMLDivElement;
	private readonly interval: number;
	private framesPerLastSecond = 0;

	/**
	 * @param containerId in which container to display the counter
	 */
	constructor(containerId: string) {
		// check if container exists
		const containerCandidate = document.getElementById(containerId);
		if (!containerCandidate) throw new Error('Container for FPS counter was not found');

		// create a new div element
		this.counterElement = document.createElement("div") as HTMLDivElement;
		this.counterElement.classList.add('fps-counter');

		containerCandidate.appendChild(this.counterElement);

		// read frames every second
		this.interval = setInterval(this.readFrames, 1000);
	}

	/**
	 * Once per second reads how many frames were rendered and updates the UI
	 */
	private readFrames = () => {
		this.counterElement.innerText = `FPS: ${this.framesPerLastSecond}`;
		this.framesPerLastSecond = 0;
	}

	/**
	 * Counts new rendered frame
	 * Call this together with your render method
	 */
	public countNewFrame() {
		this.framesPerLastSecond ++;
	}

	dispose() {
		clearInterval(this.interval);
	}
}