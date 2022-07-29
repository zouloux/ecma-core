
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
