import { ValidationContext } from "./interfaces";
export declare const Operators: {
    isPure(operator: string): boolean;
    isParenting(operator: string): boolean;
    isParentingObject(operator: string): boolean;
    isParentingArray(operator: string): boolean;
    isSkipping(operator: string): boolean;
    isNumberOperator(operator: string): boolean;
    /**
     * When input undefined, set to default value if provided, or null if nullable,
     * or throw an error if required.
     * When input is null pass if the field is nullable otherwise throw an error
     */
    undefinedOrNullInput(ctx: ValidationContext): void;
    /**
     * Checks whether the current value equals the value provided: shollow comparission
     */
    $equals(ctx: ValidationContext): void;
    /**
     * Checks whether the current value equals the referenced value provided: shollow comparission
     */
    $equalsRef(ctx: ValidationContext): void;
    /**
     * Checks whether the current value is greater than the one provided
     */
    $gt(ctx: ValidationContext): void;
    /**
     * Checks whether the current value is greater than the reference provided
     */
    $gtRef(ctx: ValidationContext): void;
    /**
     * Checks whether the current value is greater than or equals to the one provided
     */
    $gte(ctx: ValidationContext): void;
    /**
     * Checks whether the current value is greater than or equals to the reference provided
     */
    $gteRef(ctx: ValidationContext): void;
    /**
     * Checks whether the current value is less than the one provided
     */
    $lt(ctx: ValidationContext): void;
    /**
     * Checks whether the current value is less than the reference provided
     */
    $ltRef(ctx: ValidationContext): void;
    /**
     * Checks whether the current value is less than or equals to the one provided
     */
    $lte(ctx: ValidationContext): void;
    /**
     * Checks whether the current value is less than or equals to the reference provided
     */
    $lteRef(ctx: ValidationContext): void;
    /**
     * Checks whether the current value is in the range provided
     */
    $inRange(ctx: ValidationContext): void;
    /**
     * Checks if input data has values in common with provided list.
     * In negate mode input data must not share any value with provided list
     */
    $intersects(ctx: ValidationContext): void;
    /**
     * Checks that all fields in Input array are included in the provided list
     */
    $in(ctx: ValidationContext): void;
    /**
     * Checks whether input string is in the provided list,
     * Or in negate mode, the input string must not be in the provided list
     */
    $enum(ctx: ValidationContext): void;
    /**
     * checks whether the input is equal to the provided date
     */
    $on(ctx: ValidationContext): void;
    /**
     * checks whether the input is equal to the provided date reference
     */
    $onRef(ctx: ValidationContext): void;
    /**
     * checks whether the input is before the provided date
     */
    $before(ctx: ValidationContext): void;
    /**
     * checks whether the input is before the provided date reference
     */
    $beforeRef(ctx: ValidationContext): void;
    /**
     * checks whether the input is after the provided date
     */
    $after(ctx: ValidationContext): void;
    /**
     * checks whether the input is after the provided date reference
     */
    $afterRef(ctx: ValidationContext): void;
    /**
     * Checks whether the type of the current value matches the type provided
     */
    $type(ctx: ValidationContext): void;
    /**
     * Validate input date with a reference schema
     */
    $ref(ctx: ValidationContext): void;
    /**
     * Checks whether thi input value is instanve or the provided class
     */
    $instanceof(ctx: ValidationContext): void;
    /**
     * Checks whether the input value matches a spcific predeifned pattern
     */
    $is(ctx: ValidationContext): void;
    /**
     * Checks whether the previously referenced condition by '$name' operator has passed or not
     */
    $alias(ctx: ValidationContext): void;
    $name(ctx: ValidationContext): void;
    /**
     * Checks whether the input value matches a RegExp pattern
     */
    $regex(ctx: ValidationContext): void;
    /**
     * Checks if input is valid whether by refernece or by schema, then executes the '$then' statement,
     * otherwise will pass with no errors
     */
    $if(ctx: ValidationContext): boolean;
    /**
     * Loops through provided conditions until one passes or throwing error
     */
    $cond(ctx: ValidationContext): void;
    /**
     * Loops through each element in the input array and do the validation
     */
    $each(ctx: ValidationContext): void;
    /**
     * loop through a map or hashmap keys and do the validation
     */
    $map(ctx: ValidationContext): void;
    /**
     * Puts an object list of keys into the validation context
     */
    $keys(ctx: ValidationContext): void;
    /**
     * Puts an array length into the validation context
     */
    $length(ctx: ValidationContext): void;
    /**
     * Puts an object list of keys length into the validation context
     */
    $size(ctx: ValidationContext): void;
    /**
     * invert the validation result from the children operators
     */
    $not(ctx: ValidationContext): void;
    /**
     * Executes individual validation for each property in an object
     */
    $props(ctx: ValidationContext): void;
    /**
     * Executes individual validation for each property path provided
     */
    $paths(ctx: ValidationContext): void;
    /**
     * Makes sure at least on condition passes otherwise throwing an error
     */
    $or(ctx: ValidationContext): void;
    /**
     * Makes sure all conditions pass otherwise throwing an error
     */
    $and(ctx: ValidationContext): void;
    /**
     * Makes sure only one condition passes otherwise throwing an error
     */
    $xor(ctx: ValidationContext): void;
    /**
     * Makes sure none conditions pass otherwise throwing an error
     */
    $nor(ctx: ValidationContext): void;
    /**
     * Set the provided default value to the current input,
     * if the default value was "Date.now" string then it will be converted to current date instance
     * or if a pipe added to converted to string, number or Iso Date string
     */
    $default(ctx: ValidationContext): void;
    /**
     * filter the input object from any additional properties were not defined
     * in '$props' operator
     */
    $filter(ctx: ValidationContext): void;
    /**
     * throws an error if any additional properties were found ing the input object were not
     * defined in '$props' operator
     */
    $strict(ctx: ValidationContext): void;
    $to(ctx: ValidationContext): void;
    $cast(ctx: ValidationContext): void;
};
