
// ----------------------------------------------------------------------------- TYPES

/**
 * Any scalar value which can hold data and not structure :
 * - string
 * - number
 * - boolean
 */
export type ScalarValue = ( string | number | boolean )

/**
 * Record with string as key and scalar values
 */
export type ScalarRecord = Record<string, ScalarValue>

/**
 * Functional filter with generic. Describes :
 * - a function which have only one argument of type GType
 * - and returns a value of type GType
 */
export type FunctionalFilter <GType> = ( r:GType ) => GType

// ----------------------------------------------------------------------------- ARRAY

/**
 * Force any single value to be in an array.
 * Will keep arrays untouched.
 */
export function forceArray <GType = any> ( item:GType|(GType[]) ) : GType[] {
	return Array.isArray( item ) ? item : [ item ]
}

/**
 * Create an array filled with a sequence of integers, starting by 0, to length.
 * @param length Length of array to create.
 * @param value Handler to generate values.
 */
export const arrayFrom = <G = any> ( length:number, value:number|((index?:number, length?:number) => G) = null ):G[] => {
	// By default, counter handler is an incrementer from 0 to length
	if (value == null) value = i => (i as unknown as G);
	const valueIsNumber = typeof value === 'number';
	const array = Array( length ).fill( valueIsNumber ? value : null );
	return ( valueIsNumber ? array : array.map( (el, i) => (value as Function)( i, length ) ) );
};
