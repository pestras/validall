import { Validall } from './validator';
import { ISchema, IValidator, isOptions, toArgs, IValidatorOperators, INegatableOperators } from "./schema";
export declare const Operators: {
    list: string[];
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * check if key is an operator
     */
    isOperator(key: string): boolean;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Default operator
     */
    $default(src: any, defaultValue: any, path: any, validator?: any): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Filter operator
     */
    $filter(src: any, keepList: string[]): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Strict operator
     */
    $strict(src: any, keys: any, path: string, msg: string | string[]): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Type operator
     */
    $type(src: any, type: string, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Ref operator
     */
    $ref(src: any, vali: Validall, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Instance od operator
     */
    $instanceof(src: any, constructor: any, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Is operator
     */
    $is(src: any, patternName: isOptions, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Cast operator
     */
    $cast(src: any, type: 'boolean' | 'string' | 'number' | 'date' | 'regexp' | 'array', path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * To Operator
     */
    $to(src: any, methods: toArgs[], path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Equals Operator
     */
    $equals(src: any, target: any, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Deep Equals Operator
     */
    $deepEquals(src: any, target: any, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Greate Than Operator
     */
    $gt(src: any, limit: number, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Greate Than or Equal Operator
     */
    $gte(src: any, limit: number, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Less Than Operator
     */
    $lt(src: any, limit: number, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Less Than or Equal Operator
     */
    $lte(src: any, limit: number, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * In Range Operator
     */
    $inRange(src: any, range: [number, number], path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * RegExp Operator
     */
    $regex(src: any, pattern: RegExp, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Length Operator
     */
    $length(src: any, options: IValidatorOperators, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Size Operator
     */
    $size(src: any, options: IValidatorOperators, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Keys Operator
     */
    $keys(src: any, options: IValidatorOperators, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * intersect Operator
     */
    $intersect(src: any, list: string | string[], path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Enum Operator
     */
    $enum(src: any, list: string | string[], path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Include Operator
     */
    $include(src: any, list: string | string[], path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * On Operator
     */
    $on(src: any, date: string, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Before Operator
     */
    $before(src: any, date: string, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * After Operator
     */
    $after(src: any, date: string, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Not Operator
     */
    $not(src: any, options: INegatableOperators, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * And Operator
     */
    $and(src: any, options: ISchema[], path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Or Operator
     */
    $or(src: any, options: ISchema[], path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Xor Operator
     */
    $xor(src: any, options: ISchema[], path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Nor Operator
     */
    $nor(src: any, options: ISchema[], path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Each Operator
     */
    $each(src: any, schema: ISchema, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Properties Operator
     */
    $props(src: any, schema: {
        [key: string]: ISchema;
    }, path: string, msg: string | string[], validator: IValidator): void;
    /**
     * ------------------------------------------------------------------------------------------------------------------------
     * Paths Operator
     */
    $paths(src: any, schema: {
        [key: string]: ISchema;
    }, path: string, msg: string | string[], validator: IValidator): void;
};
