import { Schema } from '../schema';
import { ArrayLengthOperationOptions, IsArrayOperationOptions } from './array';
import { IsBooleanOperationOptions } from './boolean';
import { IsDateInOperationOptions, IsDateInRangeOperationOptions, IsDateNotInOperationOptions, IsDateOperationOptions, IsDateOutRangeOperationOptions } from './date';
import { EqualsOperationOptions, InRangeOperationOptions, IsInOperationOptions, IsNotInOperationOptions, NotEqualsOperationOptions, OutRangeOperationOptions, IntersectOperationOptions } from './equality';
import { AndOperationOptions, NorOperationOptions, OrOperationOptions, XorOperationOptions } from './logic';
import { IsFloatOperationOptions, IsIntOperationOptions, IsNumberOperationOptions } from './number';
import { IsStringOperationOptions, LengthOperationOptions, RegexOperationOptions } from './string';
import { ValidateOperationOptions, IsNullableOperationOptions, IsRequiredOperationOptions } from './util';

export type SchemaOperation<T> = 
ArrayLengthOperationOptions | IsArrayOperationOptions
| IsBooleanOperationOptions
| IsDateInOperationOptions | IsDateInRangeOperationOptions | IsDateNotInOperationOptions | IsDateOperationOptions | IsDateOutRangeOperationOptions
| EqualsOperationOptions<T> | InRangeOperationOptions<T> | IsInOperationOptions<T> | IsNotInOperationOptions<T> | NotEqualsOperationOptions<T> | OutRangeOperationOptions<T> | IntersectOperationOptions<T>
| AndOperationOptions | NorOperationOptions | OrOperationOptions | XorOperationOptions
| IsFloatOperationOptions | IsIntOperationOptions | IsNumberOperationOptions
| IsStringOperationOptions | LengthOperationOptions | RegexOperationOptions
| ValidateOperationOptions | IsNullableOperationOptions | IsRequiredOperationOptions;

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type ObjectSchema<T extends object> = Record<keyof T, (SchemaOperation<any> | Schema<any>)[]>;