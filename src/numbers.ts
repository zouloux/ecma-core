import { FunctionalFilter } from "./structs";

// ----------------------------------------------------------------------------- TYPES

/**
 * A 2D points
 */
export interface I2DPoint {
	x:number
	y:number
}

// ----------------------------------------------------------------------------- NUMBER CONVERSIONS

/**
 * Convert a base 10 number to an hexadecimal number
 */
export const toHex = ( n:number ) => (~~n).toString(16)

// ----------------------------------------------------------------------------- UID

let _randomUIDCollisionSeed = 1

/**
 * Create a UID based on timestamp.
 * WARNING : Not secure for critical data ! Is vulnerable to sandwich attack 🥪
 */
export const createUID = ( antiCollectionEntropy = 1, dateEntropy = 1, randomEntropy = 1 ) => {
	let parts = []
	if ( antiCollectionEntropy > 0 )
		parts.push( ++_randomUIDCollisionSeed * 489 * antiCollectionEntropy)
	if ( dateEntropy > 0 )
		parts.push( (Date.now() - 999999) * dateEntropy )
	if ( randomEntropy > 0 )
		parts.push( 99 + Math.random() * 9999 * randomEntropy )
	return parts.map( p => toHex(p) ).join("-")
}

// ----------------------------------------------------------------------------- MATHS

/**
 * Limit a value into a range.
 */
export const limitRange = ( min:number, value:number, max:number ) =>
	Math.max(min, Math.min(value, max));

/**
 * Limit a value into a symmetric range from -max to +max
 */
export const symmetricLimitRange = ( value:number, max:number ) =>
	Math.max(-max, Math.min(value, max));

/**
 * Returns positive modulo, even when 'n' is negative.
 * From http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
 */
export const positiveModulo = ( base:number, modulo:number ):number =>
	((base % modulo) + modulo) % modulo;

/**
 * Return an offset value in a range from 0 to max.
 * For example :
 * 1. if value is 8, max is 9, and you set an offset of 1, you'll get back to 0.
 *
 * It also works for negative offsets :
 * 2. If value is 0, max is 9, and you set an offset of -1, you'll get to 8
 *
 * It works with all offsets as real numbers less than max :
 * 3. If value is 3, max is 9, and you set an offset of 8, you'll get to 2
 */
export const circularRange = ( value:number, max:number, offset:number ):number =>
	 (((value + offset) % max) + max) % max;


// ----------------------------------------------------------------------------- GEOMETRY

/**
 * Compute distance between 2 points.
 */
export const distance = ( x1:number, x2:number, y1:number, y2:number ) =>
	Math.sqrt(
		+ (x2 - x1) * (x2 - x1)
		+ (y2 - y1) * (y2 - y1)
	);

/**
 * Compute distance between 2 points.
 */
export const distanceBetweenPoints = ( p1:I2DPoint, p2:I2DPoint ) =>
	distance( p1.x, p2.x, p1.y, p2.y )

/**
 * Get the angle between 3 points in radians
 * @param points An array container 3 points, each point object need to have 'x' and 'y' properties.
 * @return Angle in radians
 */
export const angle3 = ( points:[I2DPoint, I2DPoint, I2DPoint] ):number => {
	// Get 3 absolute angles
	let AB = Math.sqrt(Math.pow(points[1].x - points[0].x, 2) + Math.pow(points[1].y - points[0].y, 2));
	let BC = Math.sqrt(Math.pow(points[1].x - points[2].x, 2) + Math.pow(points[1].y - points[2].y, 2));
	let AC = Math.sqrt(Math.pow(points[2].x - points[0].x, 2) + Math.pow(points[2].y - points[0].y, 2));
	// Compute relative angle between the 3 points
	return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}

/**
 * Convert radian angle to degrees
 */
export const radToDeg = ( angle:number ):number =>
	angle / Math.PI * 180;

/**
 * Convert degree angle to radians
 */
export const degToRad = ( angle:number ):number =>
	angle / 180 * Math.PI;

/**
 * Normalize an angle to be between -Math.PI and +Math.PI
 */
export const limitAngle = ( angle:number ):number =>
	positiveModulo( angle + Math.PI, Math.PI * 2 ) - Math.PI;


// ----------------------------------------------------------------------------- RANDOM

/**
 * Random positive integer from 0 to max
 */
export const randomPositiveInt = ( max:number ) => ~~(Math.random() * max)

/**
 * Random integer between min to max
 */
export const randomInt = ( min:number, max:number ) => Math.round( randomRange(min, max ) )

/**
 * Random number between min and max
 */
export const randomRange = (min:number, max:number) => ( min + Math.random() * (max - min) );

/**
 * Symmetric random number between -max and +max
 */
export const randomSymmetricRange = ( max:number ) => ( Math.random() * max * 2 - max );

/**
 * Random sign (-1 or +1)
 */
export const randomSign = () => Math.random() > .5 ? 1 : -1;

/**
 * Random boolean with a threshold change to have tru
 */
export const randomBoolean = (threshold = .5) => (Math.random() < threshold)

/**
 * Pick random element from an array
 */
export const randomPick = <G extends any>(array:G[]):G => array[ ~~(Math.random() * array.length) ]

/**
 * Random pick a value from an object / record
 */
export const randomPickFromObject = <GType> ( object:Record<string, GType> ):GType =>
	object[ randomPick( Object.keys( object ) ) ];

/**
 * Shuffle an array
 */
export const arrayShuffle = <GType> ( array:GType[] ):GType[] => {
	const copy = [ ...array ];
	for ( let i = array.length - 1; i > 0; i-- ) {
		const j = Math.floor(Math.random() * (i + 1));
		[ copy[i], copy[j] ] = [ copy[j], copy[i] ];
	}
	return copy;
}


type ValueMap <GType> = [
	( [ (value:GType) => boolean, FunctionalFilter<GType> ] | [ FunctionalFilter<GType> ] )
]

// ----------------------------------------------------------------------------- VALUE TRANSFORMATION

/**
 * Create a function to map values from input to output with ranges.
 *
 * Structure is like this :
 * [
 * 	[ checkFunction, filterFunction ],
 * 	[ checkFunction, filterFunction ],
 * 	[ checkFunction, filterFunction ],
 * 	[ checkFunction, filterFunction ],
 * 	...
 * 	[ filterFunction ] // last one can be a filter function only
 * ]
 *
 * If checkFunction is true, filterFunction will be applied and returned.
 *
 * Example :
 * const opacityValueMap = [
 * 	[v => v >= 0 && v <= 1, r => r],
 * 	[v => v >= 3 && v <= 4, r => 1 - (r - 3)],
 * 	[r => 0]
 * ];
 *
 * const mapped = functionalValueMap( opacityValueMap );
 *
 * mapped( -1 )	 	// 0
 * mapped( 0 )	 	// 0
 * mapped( .5 ) 	// .5
 * mapped( 1 ) 		// 1
 * mapped( 2 ) 		// 1
 * mapped( 3 ) 		// 1
 * mapped( 3.5 ) 	// .5
 * mapped( 4 ) 		// 0
 * mapped( 5 ) 		// 0
 *
 */
export function functionalValueMap <GType> ( valuesMap:ValueMap<GType> ) {
	return function ( value:GType ) {
		// Browse value maps
		for ( let i = 0; i < valuesMap.length; i ++ ) {
			// Target current value map
			const currentMap = valuesMap[i];
			// Test with first function if the value have to be mapped with this map
			const test = currentMap[0]( value );
			// If this is not compatible, try next value map
			if ( !test ) continue;
			// If this is compatible
			return (
				// Map value with second function if it exists
				( 1 in currentMap )
				? valuesMap[i][1]( value )
				// Otherwise returns first test function value
				: test
			);
		}
		// If nothing is found, return value without mapping
		return value;
	}
}