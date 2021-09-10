// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ValidallError } from "./errors";
import { ISchema, ValidationContext } from "./interfaces";
import { Is } from "@pestras/toolbox/is";
import { Types } from '@pestras/toolbox/types';
import { Operators } from "./operators";
import { ReferenceState, ValidallRepo } from "./util";

export function validateSchema(schema: ISchema, path: string, ctx: ValidationContext, vName?: string) {
  for (let operator in schema) {
    let currPath = `${path}.${operator}`;
    let value = schema[<keyof ISchema>operator];

    // console.log('');
    // console.log(currPath);
    // console.log(schema);
    // console.log('-----------------------------------');
    // console.log('');

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
        throw new ValidallError(ctx, `invalid '${currPath}' date argument: (${typeof value}: ${value})`, currPath);
      
        schema[<'$on'>operator] = new Date(schema[<'$on'>operator]);
        schema.$is = 'date';

    } else if (operator === '$ref') {
      if (vName && ReferenceState.HasReference(value, vName))
        throw new ValidallError(ctx, `cycle referencing between ${value} and ${vName} validators`);

      if (!ValidallRepo.has(value))
        throw new ValidallError(ctx, `'${currPath}' reference not found: (${value})`, currPath);

      ReferenceState.SetReference(value, vName);
    }

    else if (operator === '$default' && schema.$type) {
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

      for (let prop in schema[<keyof ISchema>operator])
        validateSchema(schema[<keyof ISchema>operator][prop], `${currPath}.${prop}`, ctx);
    }

    else if (Operators.isParenting(operator)) {
      if (operator === '$each' || operator === '$length')
        schema.$type = "array";
      else if (operator === '$map' || operator === '$keys' || operator === '$size')
        schema.$type = 'object';

      validateSchema(schema[<keyof ISchema>operator], `${currPath}`, ctx);
    }

    else if (Operators.isParentingArray(operator)) {
      for (let [index, segment] of schema[<keyof ISchema>operator].entries())
        validateSchema(segment, `${currPath}.[${index}]`, ctx);
    }
  }
}