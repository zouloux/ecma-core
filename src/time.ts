

/**
 * Wait a bit, with a promise.
 */
export const delay = ( seconds:number ) => new Promise(
	resolve => setTimeout( resolve, seconds * 1000 )
);

/**
 * Compute delta time between render loops
 */
export function createDeltaCounter ( baseFrameRate = 1000 / 60 ) {
	let lastTime:number
	function computeDelta () {
		const now = Date.now()
		const delta = ( now - lastTime )
		const timeFactor = delta / baseFrameRate
		lastTime = now
		return [ timeFactor, delta ]
	}
	computeDelta();
	return computeDelta
}