// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export type isOptions = 'name' | 'email' | 'url' | 'notEmpty' | 'number' | 'date';
export type castOptions = "number" | "string" | "boolean" | "date" | "regexp" | "array";
export type toOptions = 'lowercase' | 'uppercase' | 'trim' | 'capitalizeFirst' | 'capitalizeFirstAll' | 'path';
export type typeOptions = 'number' | 'int' | 'float' | 'string' | 'boolean' | 'primitive' | 'date' | 'regexp' | 'function' | 'object' | 'array';
export type logOption = string;

export interface Logger {
  log :(...args: any[]) => void;
  debug :(...args: any[]) => void;
  info :(...args: any[]) => void;
  warn :(...args: any[]) => void;
  error :(...args: any[]) => void;
}

export interface IComparators {
  $equals?: any;
  $equalsRef?: string;
  $gt?: number;
  $gtRef?: string;
  $gte?: number;
  $gteRef?: string;
  $lt?: number;
  $ltRef?: string;
  $lte?: number;
  $lteRef?: string;
  $inRange?: [number, number];
  $intersects?: any[];
  $in?: any[];
  $enum?: any[];
  $on?: Date | number | string;
  $onRef?: string;
  $before?: Date | number | string;
  $beforeRef?: string;
  $after?: Date | number | string;
  $afterRef?: string;
  $alias?: string;
}

export interface IArrayValidators {
  $each?: ISchema;
  $length?: INumberValidators | number;
  $intersects?: any[];
  $in?: any[];
  $message?: string;
  $name?: string | [string | (ISchema & { $as: string }), ...(ISchema & { $as: string })[]];
}

export interface INumberValidators {
  $equals?: any;
  $equalsRef?: string;
  $gt?: number;
  $gtRef?: string;
  $gte?: number;
  $gteRef?: string;
  $lt?: number;
  $ltRef?: string;
  $lte?: number;
  $lteRef?: string;
  $inRange?: [number, number];
  $message?: string;
  $name?: string | [string | (ISchema & { $as: string }), ...(ISchema & { $as: string })[]];
}

export interface IDateValidators {
  $on?: Date | number | string;
  $onRef?: string;
  $before?: Date | number | string;
  $beforeRef?: string;
  $after?: Date | number | string;
  $afterRef?: string;
  $message?: string;
  $name?: string | [string | (ISchema & { $as: string }), ...(ISchema & { $as: string })[]];
}

export interface IContextuals {
  $type?: typeOptions;
  $ref?: string;
  $instanceof?: Function;
  $is?: isOptions;
  $regex?: RegExp;
}

export interface IModifiers {
  $default?: any;
  $checkDefaultType?: boolean;
  $nullable?: boolean;
  $filter?: boolean;
  $cast?: castOptions;
  $to?: toOptions[];
}

export interface INegatables {
  $equals?: any;
  $equalsRef?: string;
  $inRange?: [number, number];
  $intersects?: any[];
  $on?: Date | number | string;
  $onRef?: string;
  $instanceof?: Function;
  $regex?: RegExp;
  $alias?: string;
  $message?: string;
  $name?: string | [string | (ISchema & { $as: string }), ...(ISchema & { $as: string })[]];
}

export interface IMetaOperators {
  $log?: logOption; 
  $logMode?: keyof Logger;
  $message?: string;
  $name?: string | [string | (ISchema & { $as: string }), ...(ISchema & { $as: string })[]];
}

export interface IStructurals {
  $required?: boolean;
  $strict?: boolean;
  $each?: ISchema;
  $map?: ISchema;
  $props?: { [key: string]: ISchema };
  $paths?: { [key: string]: ISchema };
  $keys?: IArrayValidators;
  $length?: INumberValidators | number;
  $size?: INumberValidators | number;
  $message?: string;
  $name?: string | [string | (ISchema & { $as: string }), ...(ISchema & { $as: string })[]];
}

export interface ILogicals {
  $not?: INegatables;
  $and?: ISchema[];
  $or?: ISchema[];
  $xor?: ISchema[];
  $nor?: ISchema[];
}

export interface IConditionalOperators {
  $cond?: ({ $if: string | ISchema, $then: ISchema } | { $else?: ISchema; })[];
}

export interface IRootSchema {
  $props?: { [key: string]: ISchema };
  $each?: ISchema;
  $ref?: string;
  $paths?: { [key: string]: ISchema };
  $strict?: boolean;
  $filter?: boolean;
  $size?: INumberValidators | number;
  $keys?: IArrayValidators;
  $and?: ISchema[];
  $or?: ISchema[];
  $xor?: ISchema[];
  $nor?: ISchema[];
  $type?: typeOptions;
  $log?: logOption; 
  $logMode?: keyof Logger;
  $message?: string;
  $length?: INumberValidators | number;
  $cond?: ({ $if: ISchema, $then: ISchema } | { $else?: ISchema; })[];
}

export interface ISchema
  extends
  IComparators,
  IContextuals,
  IModifiers,
  IMetaOperators,
  IStructurals,
  ILogicals,
  IConditionalOperators { }

export interface IValidationPaths {
  localInputPath?: string;
  inputPath?: string;
}

export class ValidationContext {
  logger: Logger;
  loggerDisabled: boolean;
  currentInput: any;
  input: any;
  schema: Partial<ISchema>;
  localPath?: string;
  inputPath?: string;
  message = '';
  parentOperator = '';
  negateMode = false;
  aliasStates: { [key: string]: boolean } = {};
  parentCtx?: ValidationContext;
  next: (ctx: ValidationContext) => void;

  constructor(ctx?: Partial<ValidationContext>) {
    !!ctx && Object.assign(this, ctx);
  }

  clone(ctx: Partial<ValidationContext>): ValidationContext {
    return new ValidationContext(Object.assign({}, this, ctx));
  }

  get fullPath() {
    return ValidationContext.JoinPath(this.inputPath, this.localPath);
  }

  static JoinPath(parent: string, child: string | number) {
    let path = "";

    if (parent) {
      path += parent;

      if (child) {
        if (typeof child === 'number')
          path += `[${child}]`;
        else
          path += '.' + child
      }
    } else {
      if (typeof child === 'number')
        path = `[${child}]`;
      else
        path = child || ''
    }
    
    return path;
  }
}