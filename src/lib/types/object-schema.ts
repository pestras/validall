import { Schema } from '../schema';
import { BaseOperatorOptions } from './base';

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type ObjectSchema<T extends object> = Record<keyof T, (BaseOperatorOptions | Schema<any>)[]>;