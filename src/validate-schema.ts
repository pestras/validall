// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ValidallError } from "./errors";
import { IOperators, ValidationContext } from "./interfaces";
import { Is } from "./is";
import { Types } from './types';
import { Operators } from "./operators";
import { ReferenceState, ValidallRepo, globalOptions } from "./util";

export function validateSchema(schema: IOperators, path: string, ctx: ValidationContext, vName?: string) {
  for (const operator in schema) {
    let currPath = `${path}.${operator}`;
    let value = schema[<keyof IOperators>operator];


    if (operator === '$name')
      if (typeof schema.$name === 'string')
        ctx.aliasStates[schema.$name] = false;
      else
        for (let $name of schema.$name)
          if (typeof $name === 'string')
            ctx.aliasStates[$name] = false;
          else
            ctx.aliasStates[$name.$as] = false;
    // check date
    else if (['$on', '$before', '$after'].indexOf(operator) > -1) {
      if (!Is.date(value))
        throw new ValidallError(ctx, `invalid '${currPath}' date argument: (${typeof value}: ${value})`);

      schema[<'$on'>operator] = new Date(schema[<'$on'>operator] as string);
      schema.$is = 'date';

    } else if (operator === '$ref') {
      if (vName && ReferenceState.HasReference(value, vName))
        throw new ValidallError(ctx, `cycle referencing between ${value} and ${vName} validators`);

      if (!ValidallRepo.has(value))
        throw new ValidallError(ctx, `'${currPath}' reference not found: (${value})`);

      ReferenceState.SetReference(value, vName);
    }

    else if ((operator === '$default' || operator === '$set') && schema.$type) {
      if (typeof value === 'string' && value.charAt(0) === '$')
        return;

      if (!Types[schema.$type](value))
        throw new ValidallError(ctx, `invalid '${currPath}' argument type: (${typeof value}: ${value}), expected to be of type (${schema.$type})`);

    } else if (operator === '$min' || operator === '$max')
      schema.$type = 'number';

    else if ((operator === '$filter' || operator === '$strict') && !schema.$props)
      throw new ValidallError(ctx, `'${currPath}' requires a sibling '$props' operator`);

    else if (Operators.isNumberOperator(operator)) {
      schema.$type = "number";
    }

    else if (Operators.isParentingObject(operator)) {
      schema.$type = "object";

      for (let prop in schema[<keyof IOperators>operator])
        validateSchema(schema[<keyof IOperators>operator][prop], `${currPath}.${prop}`, ctx);
    }

    else if (Operators.isParenting(operator)) {
      if (operator === '$each' || operator === '$tuple') {
        schema.$type = "array";

        if (operator === '$tuple')
          schema.$length = schema.$tuple.length;

      } else if (operator === '$map' || operator === '$keys' || operator === '$size')
        schema.$type = 'object';

      else if (['$year', '$month', '$day', '$hours', '$minutes', '$seconds'].indexOf(operator) > -1)
        schema.$is = 'date';

      validateSchema(schema[<keyof IOperators>operator], `${currPath}`, ctx);
    }

    else if (Operators.isParentingArray(operator)) {
      for (let [index, segment] of schema[<keyof IOperators>operator].entries())
        validateSchema(segment, `${currPath}.[${index}]`, ctx);
    }
  }
}