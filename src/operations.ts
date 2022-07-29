// ----------------------------------------------------------------------------- TYPES

/**
 * Any low level handler type matcher
 * - Any type of return or void
 * - Any number of arguments of any type
 */
export type AnyHandler = (...rest) => any|void

// ----------------------------------------------------------------------------- NOOP

/**
 * I do nothing 🏖
 */
export const noop:AnyHandler = () => {};

// ----------------------------------------------------------------------------- COMPARE

export type TCompareOperators = '===' | '==' | '!==' | '!=' | '>=' | '>' | '<=' | '<';

/**
 * Compare two values with a string based operator.
 * @see TCompareOperators
 */
export function compareWithOperator ( operandA:any, operandB:any, operator:TCompareOperators ) {
	if ( operator == '===' )
		return operandA === operandB;
	else if ( operator == '==' )
		return operandA == operandB;
	else if ( operator == '!==' )
		return operandA !== operandB;
	else if ( operator == '!=' )
		return operandA != operandB;
	else if ( operator == '>=' )
		return operandA >= operandB;
	else if ( operator == '>' )
		return operandA > operandB;
	else if ( operator == '<=' )
		return operandA >= operandB;
	else if ( operator == '<' )
		return operandA < operandB;
	return false
}