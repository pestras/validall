"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operators = void 0;
const is_1 = require("@pestras/toolbox/is");
const get_value_1 = require("@pestras/toolbox/object/get-value");
const inject_value_1 = require("@pestras/toolbox/object/inject-value");
const omit_1 = require("@pestras/toolbox/object/omit");
const cast_1 = require("@pestras/toolbox/cast");
const types_1 = require("@pestras/toolbox/types");
const errors_1 = require("./errors");
const interfaces_1 = require("./interfaces");
const util_1 = require("./util");
const pureOperators = new Set([
    '$equals',
    '$equalsRef',
    '$gt',
    '$gtRef',
    '$gte',
    '$gteRef',
    '$lt',
    '$ltRef',
    '$lte',
    '$lteRef',
    '$inRange',
    '$intersects',
    '$in',
    '$enum',
    '$on',
    '$onRef',
    '$before',
    '$beforeRef',
    '$after',
    '$afterRef',
    '$type',
    '$ref',
    '$instanceof',
    '$is',
    '$regex'
]);
const parentingOperators = new Set([
    '$each',
    '$map',
    '$keys',
    '$length',
    '$size',
    '$not',
    '$if',
    '$then',
    '$else'
]);
const parentingObjectOperators = new Set([
    '$props',
    '$paths'
]);
const parentingArrayOperators = new Set([
    '$or',
    '$and',
    '$xor',
    '$nor',
    '$cond'
]);
const skippedOperators = new Set([
    '$default',
    '$required',
    '$nullable',
    '$message',
    '$then',
    '$else'
]);
const numberOperators = new Set([
    '$gt',
    '$gtRef',
    '$gte',
    '$gteRef',
    '$lt',
    '$ltRef',
    '$lte',
    '$lteRef',
    '$inRange'
]);
const modifierOperators = new Set([
    '$to',
    '$cast'
]);
exports.Operators = {
    isPure(operator) {
        return pureOperators.has(operator);
    },
    isParenting(operator) {
        return parentingOperators.has(operator);
    },
    isParentingObject(operator) {
        return parentingObjectOperators.has(operator);
    },
    isParentingArray(operator) {
        return parentingArrayOperators.has(operator);
    },
    isSkipping(operator) {
        return skippedOperators.has(operator);
    },
    isNumberOperator(operator) {
        return numberOperators.has(operator);
    },
    /**
     * When input undefined, set to default value if provided, or null if nullable,
     * or throw an error if required.
     * When input is null pass if the field is nullable otherwise throw an error
     */
    undefinedOrNullInput(ctx) {
        // if src is null and $nullable is enabled
        // register field to validator nullables then exit
        if (ctx.currentInput === null)
            if (ctx.schema.$nullable)
                return;
            else
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' is not nullable`, ctx.fullPath);
        // if input is undefined and $default operator was set, use the default value
        if (ctx.schema.$default !== undefined)
            return this.$default(ctx);
        // if $default was not set
        // check if $nullable operator is set to true
        if (ctx.schema.$nullable) {
            if (ctx.localPath)
                inject_value_1.injectValue(ctx.input, ctx.localPath, null);
            return;
        }
        // if field is required throw a validation error
        if (ctx.schema.$required)
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' field is required`, ctx.fullPath);
    },
    /**
     * Checks whether the current value equals the value provided: shollow comparission
     */
    $equals(ctx) {
        if (ctx.currentInput === ctx.schema.$equals && ctx.negateMode)
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not equal '${ctx.schema.$equals}'`, ctx.fullPath);
        else if (ctx.currentInput !== ctx.schema.$equals && !ctx.negateMode)
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must equal '${ctx.schema.$equals}', got: (${typeof ctx.currentInput}, '${ctx.currentInput}')`, ctx.fullPath);
    },
    /**
     * Checks whether the current value equals the referenced value provided: shollow comparission
     */
    $equalsRef(ctx) {
        if (ctx.currentInput === ctx.schema.$equalsRef && ctx.negateMode)
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not equal '${ctx.schema.$equalsRef}'`, ctx.fullPath);
        else if (ctx.currentInput !== ctx.schema.$equalsRef && !ctx.negateMode)
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must equal '${ctx.schema.$equalsRef}', got: (${typeof ctx.currentInput}, '${ctx.currentInput}')`, ctx.fullPath);
    },
    /**
     * Checks whether the current value is greater than the one provided
     */
    $gt(ctx) {
        if (ctx.currentInput <= ctx.schema.$gt) {
            let context = ctx.parentOperator === '$size'
                ? 'size'
                : ctx.parentOperator === '$length'
                    ? 'length'
                    : 'value';
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' ${context} must be greater than ${ctx.schema.$gt}, got: ${ctx.currentInput}`, ctx.fullPath);
        }
    },
    /**
     * Checks whether the current value is greater than the reference provided
     */
    $gtRef(ctx) {
        if (ctx.currentInput <= ctx.schema.$gtRef) {
            let context = ctx.parentOperator === '$size'
                ? 'size'
                : ctx.parentOperator === '$length'
                    ? 'length'
                    : 'value';
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' ${context} must be greater than ${ctx.schema.$gtRef}, got: ${ctx.currentInput}`, ctx.fullPath);
        }
    },
    /**
     * Checks whether the current value is greater than or equals to the one provided
     */
    $gte(ctx) {
        if (ctx.currentInput < ctx.schema.$gte) {
            let context = ctx.parentOperator === '$size'
                ? 'size'
                : ctx.parentOperator === '$length'
                    ? 'length'
                    : 'value';
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' ${context} must be greater than or equals to ${ctx.schema.$gte}, got: ${ctx.currentInput}`, ctx.fullPath);
        }
    },
    /**
     * Checks whether the current value is greater than or equals to the reference provided
     */
    $gteRef(ctx) {
        if (ctx.currentInput < ctx.schema.$gteRef) {
            let context = ctx.parentOperator === '$size'
                ? 'size'
                : ctx.parentOperator === '$length'
                    ? 'length'
                    : 'value';
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' ${context} must be greater than or equals to ${ctx.schema.$gteRef}, got: ${ctx.currentInput}`, ctx.fullPath);
        }
    },
    /**
     * Checks whether the current value is less than the one provided
     */
    $lt(ctx) {
        if (ctx.currentInput >= ctx.schema.$lt) {
            let context = ctx.parentOperator === '$size'
                ? 'size'
                : ctx.parentOperator === '$length'
                    ? 'length'
                    : 'value';
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' ${context} must be less than ${ctx.schema.$lt}, got: ${ctx.currentInput}`, ctx.fullPath);
        }
    },
    /**
     * Checks whether the current value is less than the reference provided
     */
    $ltRef(ctx) {
        if (ctx.currentInput >= ctx.schema.$ltRef) {
            let context = ctx.parentOperator === '$size'
                ? 'size'
                : ctx.parentOperator === '$length'
                    ? 'length'
                    : 'value';
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' ${context} must be less than ${ctx.schema.$ltRef}, got: ${ctx.currentInput}`, ctx.fullPath);
        }
    },
    /**
     * Checks whether the current value is less than or equals to the one provided
     */
    $lte(ctx) {
        if (ctx.currentInput > ctx.schema.$lte) {
            let context = ctx.parentOperator === '$size'
                ? 'size'
                : ctx.parentOperator === '$length'
                    ? 'length'
                    : 'value';
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' ${context} must be less than or equals to ${ctx.schema.$lte}, got: ${ctx.currentInput}`, ctx.fullPath);
        }
    },
    /**
     * Checks whether the current value is less than or equals to the reference provided
     */
    $lteRef(ctx) {
        if (ctx.currentInput > ctx.schema.$lteRef) {
            let context = ctx.parentOperator === '$size'
                ? 'size'
                : ctx.parentOperator === '$length'
                    ? 'length'
                    : 'value';
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' ${context} must be less than or equals to ${ctx.schema.$lteRef}, got: ${ctx.currentInput}`, ctx.fullPath);
        }
    },
    /**
     * Checks whether the current value is in the range provided
     */
    $inRange(ctx) {
        let inRange = ctx.currentInput >= ctx.schema.$inRange[0] && ctx.currentInput <= ctx.schema.$inRange[1];
        let context = ctx.parentOperator === '$size'
            ? 'size'
            : ctx.parentOperator === '$length'
                ? 'length'
                : 'value';
        if (inRange) {
            if (ctx.negateMode)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' ${context} must be out of range between [${ctx.schema.$inRange}], got: ${ctx.currentInput}`, ctx.fullPath);
        }
        else
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' ${context} must be in range between [${ctx.schema.$inRange}], got: ${ctx.currentInput}`, ctx.fullPath);
    },
    /**
     * Checks if input data has values in common with provided list.
     * In negate mode input data must not share any value with provided list
     */
    $intersects(ctx) {
        let type = ctx.parentOperator === '$keys' ? 'property' : 'value';
        let [looper, checker] = ctx.currentInput.length < ctx.schema.$intersects
            ? [ctx.currentInput, ctx.schema.$intersects]
            : [ctx.schema.$intersects, ctx.currentInput];
        for (let prop of looper) {
            if (checker.includes(prop))
                if (ctx.negateMode)
                    throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not have any ${type} with [${ctx.schema.$intersects}], got: (${prop})`, ctx.fullPath);
                else
                    return;
        }
        if (!ctx.negateMode)
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must have at least on ${type} with [${ctx.schema.$intersects}]`, ctx.fullPath);
    },
    /**
     * Checks that all fields in Input array are included in the provided list
     */
    $in(ctx) {
        for (let val of ctx.currentInput)
            if (!ctx.schema.$in.includes(val)) {
                let type = ctx.parentOperator === '$keys' ? 'property' : 'value';
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not have any ${type} out of [${ctx.schema.$in}], got: (${val})`, ctx.fullPath);
            }
    },
    /**
     * Checks whether input string is in the provided list,
     * Or in negate mode, the input string must not be in the provided list
     */
    $enum(ctx) {
        let included = ctx.schema.$enum.includes(ctx.currentInput);
        if (included && ctx.negateMode)
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not equals any value in [${ctx.schema.$enum}], got: (${ctx.currentInput})`, ctx.fullPath);
        else if (!included && !ctx.negateMode)
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must equals any value in [${ctx.schema.$enum}], got: (${ctx.currentInput})`, ctx.fullPath);
    },
    /**
     * checks whether the input is equal to the provided date
     */
    $on(ctx) {
        let date = new Date(ctx.currentInput);
        if (date.getTime() === ctx.schema.$on.getTime()) {
            if (ctx.negateMode)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not be on date: '${ctx.schema.$on.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
        }
        else
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must be on date: '${ctx.schema.$on.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
    },
    /**
     * checks whether the input is equal to the provided date reference
     */
    $onRef(ctx) {
        let date = new Date(ctx.currentInput);
        let refDate = new Date(ctx.schema.$onRef);
        if (date.getTime() === refDate.getTime()) {
            if (ctx.negateMode)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not be on date: '${refDate.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
        }
        else
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must be on date: '${refDate.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
    },
    /**
     * checks whether the input is before the provided date
     */
    $before(ctx) {
        let date = new Date(ctx.currentInput);
        if (date.getTime() < ctx.schema.$before.getTime()) {
            if (ctx.negateMode)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not be before date: '${ctx.schema.$before.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
        }
        else
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must be before date: '${ctx.schema.$before.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
    },
    /**
     * checks whether the input is before the provided date reference
     */
    $beforeRef(ctx) {
        let date = new Date(ctx.currentInput);
        let refDate = new Date(ctx.schema.$beforeRef);
        if (date.getTime() < refDate.getTime()) {
            if (ctx.negateMode)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not be before date: '${refDate.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
        }
        else
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must be before date: '${refDate.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
    },
    /**
     * checks whether the input is after the provided date
     */
    $after(ctx) {
        let date = new Date(ctx.currentInput);
        if (date.getTime() > ctx.schema.$after.getTime()) {
            if (ctx.negateMode)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not be after date: '${ctx.schema.$after.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
        }
        else
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must be after date: '${ctx.schema.$after.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
    },
    /**
     * checks whether the input is after the provided date reference
     */
    $afterRef(ctx) {
        let date = new Date(ctx.currentInput);
        let refDate = new Date(ctx.schema.$afterRef);
        if (date.getTime() > refDate.getTime()) {
            if (ctx.negateMode)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not be after date: '${refDate.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
        }
        else
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must be after date: '${refDate.toLocaleString()}', got: (${date.toLocaleString()})`, ctx.fullPath);
    },
    /**
     * Checks whether the type of the current value matches the type provided
     */
    $type(ctx) {
        if (types_1.Types.getTypesOf(ctx.currentInput).indexOf(ctx.schema.$type) === -1) {
            let inputType = Array.isArray(ctx.currentInput)
                ? 'array'
                : ctx.schema.$type === 'int' || ctx.schema.$type === 'float'
                    ? types_1.Types.getTypesOf(ctx.currentInput)
                    : typeof ctx.currentInput;
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must be of type '${ctx.schema.$type}', got: (${inputType}, ${ctx.currentInput})`, ctx.fullPath);
        }
    },
    /**
     * Validate input date with a reference schema
     */
    $ref(ctx) {
        util_1.ValidallRepo.get(ctx.schema.$ref).validate(ctx.currentInput, ctx.fullPath);
    },
    /**
     * Checks whether thi input value is instanve or the provided class
     */
    $instanceof(ctx) {
        if (ctx.currentInput instanceof ctx.schema.$instanceof) {
            if (ctx.negateMode)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not be instance of '${ctx.schema.$instanceof.name}}'`, ctx.fullPath);
        }
        else
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must be instance of '${ctx.schema.$instanceof.name}'`, ctx.fullPath);
    },
    /**
     * Checks whether the input value matches a spcific predeifned pattern
     */
    $is(ctx) {
        if (!is_1.Is[ctx.schema.$is](ctx.currentInput)) {
            let msgSuffix = ["email", "date", "url"].indexOf(ctx.schema.$is) > -1
                ? `be a valid ${ctx.schema.$is}`
                : ctx.schema.$is === "name"
                    ? 'include only alphabetical characters'
                    : ctx.schema.$is === "number"
                        ? "include only numbers"
                        : "be not empty";
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must ${msgSuffix}, got: (${ctx.currentInput})`, ctx.fullPath);
        }
    },
    /**
     * Checks whether the previously referenced condition by '$name' operator has passed or not
     */
    $alias(ctx) {
        let passed = ctx.aliasStates[ctx.schema.$alias];
        if (passed) {
            if (ctx.negateMode)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' name '${ctx.schema.$alias}' should not pass`, ctx.fullPath);
        }
        else
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' name '${ctx.schema.$alias}' should pass`, ctx.fullPath);
    },
    $name(ctx) {
        for (let test of ctx.schema.$name) {
            if (typeof test === 'string')
                continue;
            try {
                ctx.next(ctx.clone({ schema: test }));
                ctx.aliasStates[test.$as] = true;
            }
            catch (error) {
                ctx.aliasStates[test.$as] = false;
            }
        }
    },
    /**
     * Checks whether the input value matches a RegExp pattern
     */
    $regex(ctx) {
        if (ctx.schema.$regex.test(ctx.currentInput)) {
            if (ctx.negateMode)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must not match pattern '${ctx.schema.$regex}', got: (${ctx.currentInput})`, ctx.fullPath);
        }
        else
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' must match pattern '${ctx.schema.$regex}', got: (${ctx.currentInput})`, ctx.fullPath);
    },
    /**
     * Checks if input is valid whether by refernece or by schema, then executes the '$then' statement,
     * otherwise will pass with no errors
     */
    $if(ctx) {
        try {
            ctx.next(ctx);
        }
        catch (error) {
            return false;
        }
        return true;
    },
    /**
     * Loops through provided conditions until one passes or throwing error
     */
    $cond(ctx) {
        for (let condition of ctx.schema.$cond) {
            if (condition.$if) {
                if (typeof condition.$if === 'string') {
                    if (ctx.aliasStates[condition.$if])
                        return ctx.next(ctx.clone({ schema: condition.$then }));
                }
                else if (exports.Operators.$if(ctx.clone({ currentInput: ctx.input, schema: condition.$if, localPath: '' })))
                    return ctx.next(ctx.clone({ schema: condition.$then }));
            }
            else if (condition.$else) {
                ctx.next(ctx.clone({ schema: condition.$else }));
            }
        }
    },
    /**
     * Loops through each element in the input array and do the validation
     */
    $each(ctx) {
        for (let i = 0; i < ctx.currentInput.length; i++)
            ctx.next(ctx.clone({
                currentInput: ctx.currentInput[i],
                localPath: interfaces_1.ValidationContext.JoinPath(ctx.localPath, i),
                schema: ctx.schema.$each
            }));
    },
    /**
     * loop through a map or hashmap keys and do the validation
     */
    $map(ctx) {
        for (let prop in ctx.currentInput)
            ctx.next(ctx.clone({
                currentInput: ctx.currentInput[prop],
                localPath: interfaces_1.ValidationContext.JoinPath(ctx.localPath, prop),
                schema: ctx.schema.$map
            }));
    },
    /**
     * Puts an object list of keys into the validation context
     */
    $keys(ctx) {
        ctx.next(ctx.clone({
            currentInput: Object.keys(ctx.currentInput),
            schema: ctx.schema.$keys,
            parentOperator: '$keys'
        }));
    },
    /**
     * Puts an array length into the validation context
     */
    $length(ctx) {
        let length = ctx.currentInput.length;
        if (typeof ctx.schema.$length === 'number') {
            if (length !== ctx.schema.$length)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' length must be ${ctx.schema.$length}, got: ${length}`);
        }
        else
            ctx.next(ctx.clone({
                currentInput: length,
                schema: ctx.schema.$length,
                parentOperator: '$length'
            }));
    },
    /**
     * Puts an object list of keys length into the validation context
     */
    $size(ctx) {
        let size = Object.keys(ctx.currentInput).length;
        if (typeof ctx.schema.$size === 'number') {
            if (size !== ctx.schema.$size)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' size must be ${ctx.schema.$size}, got: ${size}`);
        }
        else
            ctx.next(ctx.clone({
                currentInput: size,
                schema: ctx.schema.$size,
                parentOperator: '$size'
            }));
    },
    /**
     * invert the validation result from the children operators
     */
    $not(ctx) {
        ctx.next(ctx.clone({
            schema: ctx.schema.$not,
            negateMode: true
        }));
    },
    /**
     * Executes individual validation for each property in an object
     */
    $props(ctx) {
        for (let prop in ctx.schema.$props)
            ctx.next(ctx.clone({
                currentInput: ctx.currentInput[prop],
                schema: ctx.schema.$props[prop],
                localPath: interfaces_1.ValidationContext.JoinPath(ctx.localPath, prop)
            }));
    },
    /**
     * Executes individual validation for each property path provided
     */
    $paths(ctx) {
        for (let prop in ctx.schema.$paths)
            ctx.next(ctx.clone({
                currentInput: get_value_1.getValue(ctx.currentInput, prop),
                schema: ctx.schema.$paths[prop],
                localPath: interfaces_1.ValidationContext.JoinPath(ctx.localPath, prop)
            }));
    },
    /**
     * Makes sure at least on condition passes otherwise throwing an error
     */
    $or(ctx) {
        for (let condition of (ctx.schema.$or)) {
            try {
                ctx.next(ctx.clone({ schema: condition }));
                return;
            }
            catch (e) {
                continue;
            }
        }
        throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' failed all validations`, ctx.fullPath);
    },
    /**
     * Makes sure all conditions pass otherwise throwing an error
     */
    $and(ctx) {
        try {
            for (let condition of ctx.schema.$and)
                ctx.next(ctx.clone({ schema: condition }));
        }
        catch (e) {
            throw new errors_1.ValidallError(ctx.message || e.message, e.path);
        }
    },
    /**
     * Makes sure only one condition passes otherwise throwing an error
     */
    $xor(ctx) {
        let passedIndexes = [];
        for (let [i, condition] of ctx.schema.$xor.entries()) {
            try {
                ctx.next(ctx.clone({ schema: condition }));
                passedIndexes.push(i);
            }
            catch (e) {
                continue;
            }
            if (passedIndexes.length > 1)
                throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' has passed more then one validation: [${passedIndexes}]`, ctx.fullPath);
        }
        if (passedIndexes.length === 0)
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' failed all validations`, ctx.fullPath);
    },
    /**
     * Makes sure none conditions pass otherwise throwing an error
     */
    $nor(ctx) {
        let passed = [];
        for (let [i, condition] of ctx.schema.$nor.entries()) {
            try {
                ctx.next(ctx.clone({ schema: condition }));
                passed.push(i);
            }
            catch (e) {
                continue;
            }
        }
        if (passed.length > 0)
            throw new errors_1.ValidallError(ctx.message || `'${ctx.fullPath}' has passed one or more validation: [${passed}]`, ctx.fullPath);
    },
    /**
     * Set the provided default value to the current input,
     * if the default value was "Date.now" string then it will be converted to current date instance
     * or if a pipe added to converted to string, number or Iso Date string
     */
    $default(ctx) {
        let value = ctx.schema.$default;
        if (typeof value === 'string') {
            if (value.charAt(0) === "$") {
                let ref = value.slice(1);
                value = get_value_1.getValue(ctx.input, ref);
                if (!value)
                    throw new errors_1.ValidallError(`undefined reference '$${ref} passed to '${ctx.fullPath}'`);
                else if (!!ctx.schema.$type && types_1.Types.getTypesOf(value).indexOf(ctx.schema.$type) === -1)
                    throw new errors_1.ValidallError(`invalid reference type '$${ref} passed to '${ctx.fullPath}'`);
            }
            else if (value.indexOf("Date.now") === 0) {
                if (value.indexOf("string") > -1)
                    value = new Date().toLocaleString();
                else if (value.indexOf("number"))
                    value = new Date().getTime();
                else if (value.indexOf("iso"))
                    value = new Date().toISOString();
                else
                    value = new Date();
            }
        }
        inject_value_1.injectValue(ctx.input, ctx.localPath, value);
    },
    /**
     * filter the input object from any additional properties were not defined
     * in '$props' operator
     */
    $filter(ctx) {
        let keys = Object.keys(ctx.schema.$props);
        let omitKeys = [];
        for (let key in ctx.currentInput)
            if (keys.indexOf(key) === -1)
                omitKeys.push(key);
        if (omitKeys.length > 0)
            omit_1.omit(ctx.currentInput, omitKeys);
    },
    /**
     * throws an error if any additional properties were found ing the input object were not
     * defined in '$props' operator
     */
    $strict(ctx) {
        let keys = Object.keys(ctx.schema.$props);
        // if no keys then strict mode is off
        if (!keys || keys.length === 0)
            return;
        // loop through src keys and find invalid keys
        for (let key in ctx.currentInput)
            if (keys.indexOf(key) === -1)
                throw new errors_1.ValidallError(ctx.message || `'${interfaces_1.ValidationContext.JoinPath(ctx.fullPath, key)}' field is not allowed`, ctx.fullPath);
    },
    $to(ctx) {
        for (let method of ctx.schema.$to) {
            try {
                inject_value_1.injectValue(ctx.input, ctx.localPath, util_1.To[method](get_value_1.getValue(ctx.input, ctx.localPath)));
            }
            catch (err) {
                throw new errors_1.ValidallError(`error modifying input value '${ctx.currentInput}' using ($to: ${method})`);
            }
        }
    },
    $cast(ctx) {
        try {
            // try to cast src
            inject_value_1.injectValue(ctx.input, ctx.localPath, cast_1.cast(ctx.currentInput, ctx.schema.$cast));
        }
        catch (err) {
            throw new errors_1.ValidallError(`error casting '${ctx.fullPath}' to '${ctx.schema.$cast}'`);
        }
    }
};
//# sourceMappingURL=operators.js.map