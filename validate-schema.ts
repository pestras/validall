// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ValidallError } from "./errors.ts";
import { ISchema, ValidationContext } from "./interfaces.ts";
import { ReferenceState, ValidallRepo, Types, Is } from "./util.ts";
import { Operators } from "./operators.ts";

export function validateSchema(schema: ISchema, path: string, ctx: ValidationContext, vName?: string) {
  for (const operator in schema) {
    const currPath = `${path}.${operator}`;
    const value = schema[<keyof ISchema>operator];

    // console.log('');
    // console.log(currPath);
    // console.log(schema);
    // console.log('-----------------------------------');
    // console.log('');

    if (operator === '$name')
      if (typeof schema.$name === 'string')
        ctx.aliasStates[schema.$name] = false;
      else
        for (const $name of schema.$name!)
          if (typeof $name === 'string')
            ctx.aliasStates[$name] = false;
          else
            ctx.aliasStates[$name.$as] = false;
    // check date
    else if (['$on', '$before', '$after'].indexOf(operator) > -1) {
      if (!Is.date(value))
        throw new ValidallError(ctx, `invalid '${currPath}' date argument: (${typeof value}: ${value})`, currPath);

      schema[<'$on'>operator] = new Date(schema[<'$on'>operator]!);
      schema.$is = 'date';

    } else if (operator === '$ref') {
      if (vName && ReferenceState.HasReference(value, vName))
        throw new ValidallError(ctx, `cycle referencing between ${value} and ${vName} validators`);

      if (!ValidallRepo.has(value))
        throw new ValidallError(ctx, `'${currPath}' reference not found: (${value})`, currPath);

      ReferenceState.SetReference(value, vName!);
    }

    else if (operator === '$default' && schema.$type) {
      if (typeof value === 'string' && value.charAt(0) === '$')
        return;

      if (!Types[schema.$type](value))
        throw new ValidallError(ctx, `invalid '${currPath}' argument type: (${typeof value}: ${value}), expected to be of type (${schema.$type})`, currPath);
    }

    else if ((operator === '$filter' || operator === '$strict') && !schema.$props)
      throw new ValidallError(ctx, `'${currPath}' requires a sibling '$props' operator`, currPath);

    else if (Operators.isNumberOperator(operator)) {
      schema.$type = "number";
    }

    else if (Operators.isParentingObject(operator)) {
      schema.$type = "object";

      for (const prop in schema[<keyof ISchema>operator])
        validateSchema(schema[<keyof ISchema>operator][prop], `${currPath}.${prop}`, ctx);
    }

    else if (Operators.isParenting(operator)) {
      if (operator === '$each' || operator === '$tuple') {
        schema.$type = "array";

        if (operator === '$tuple') {
          if (!Array.isArray(schema.$tuple))
            throw new ValidallError(ctx, `'${currPath}' must be an array of validators`, currPath);
            
          schema.$length = schema.$tuple?.length;
        }

      } else if (operator === '$length')
        schema.$type = schema.$type === 'string' ? 'string' : "array";
        
      else if (operator === '$map' || operator === '$keys' || operator === '$size')
        schema.$type = 'object';

      validateSchema(schema[<keyof ISchema>operator], `${currPath}`, ctx);
    }

    else if (Operators.isParentingArray(operator)) {
      for (const [index, segment] of schema[<keyof ISchema>operator].entries())
        validateSchema(segment, `${currPath}.[${index}]`, ctx);
    }
  }
}