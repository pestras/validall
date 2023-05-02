// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export type isOptions = 'name' | 'email' | 'url' | 'notEmpty' | 'number' | 'date';
export type castOptions = "number" | "string" | "boolean" | "date" | "regexp" | "array";
export type toOptions = 'lowercase' | 'uppercase' | 'trim' | 'capitalizeFirst' | 'capitalizeFirstAll' | 'path';
export type typeOptions = 'number' | 'int' | 'float' | 'string' | 'boolean' | 'primitive' | 'date' | 'regexp' | 'function' | 'object' | 'array';
export type logOption = (keyof ValidationContext)[];

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
  $fn?: (value: any, ctx?: ValidationContext) => void | never;
}

export interface IArrayValidators {
  $each?: ISchema | IOperators;
  $tuple?: (ISchema | IOperators)[];
  $length?: INumberValidators | number;
  $intersects?: any[];
  $in?: any[];
  $message?: string;
  $log?: logOption; 
  $logMode?: keyof Logger;
  $name?: string | [string | (IOperators & { $as: string }), ...(IOperators & { $as: string })[]];
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
  $min?: number;
  $max?: number;
  $message?: string;
  $log?: logOption; 
  $logMode?: keyof Logger;
  $name?: string | [string | (IOperators & { $as: string }), ...(IOperators & { $as: string })[]];
}

export interface IStringVaidators {
  $equals?: any;
  $enum?: string[];
  $regex?: RegExp;
}

export interface IDateValidators {
  $on?: Date | number | string;
  $onRef?: string;
  $before?: Date | number | string;
  $beforeRef?: string;
  $after?: Date | number | string;
  $afterRef?: string;
  $message?: string;
  $log?: logOption; 
  $logMode?: keyof Logger;
  $name?: string | [string | (IOperators & { $as: string }), ...(IOperators & { $as: string })[]];
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
  $cast?: castOptions | ((value: any, ctx?: ValidationContext) => any | never);
  $set?: any;
  $min?: number;
  $max?: number;
  $to?: toOptions[] | ((value: any, ctx?: ValidationContext) => any | never);
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
  $log?: logOption; 
  $logMode?: keyof Logger;
  $name?: string | [string | (IOperators & { $as: string }), ...(IOperators & { $as: string })[]];
}

export interface IMetaOperators {
  $log?: logOption; 
  $logMode?: keyof Logger;
  $message?: string;
  $name?: string | [string | (IOperators & { $as: string }), ...(IOperators & { $as: string })[]];
}

export interface IStructurals {
  $required?: boolean;
  $strict?: boolean;
  $each?: ISchema | IOperators;
  $tuple?: (ISchema | IOperators)[];
  $map?: ISchema | IOperators;
  $props?: { [key: string]: ISchema | IOperators };
  $paths?: { [key: string]: ISchema | IOperators };
  $keys?: IArrayValidators;
  $length?: INumberValidators | number;
  $size?: INumberValidators | number;
  $year?: INumberValidators | number;
  $month?: INumberValidators | number;
  $day?: INumberValidators | number;
  $hours?: INumberValidators | number;
  $minutes?: INumberValidators | number;
  $seconds?: INumberValidators | number;
  $message?: string;
  $log?: logOption; 
  $logMode?: keyof Logger;                                  
  $name?: string | [string | (IOperators & { $as: string }), ...(IOperators & { $as: string })[]];
}

export interface ILogicals {
  $not?: INegatables;
  $and?: (ISchema | IOperators)[];
  $or?: (ISchema | IOperators)[];
  $xor?: (ISchema | IOperators)[];
  $nor?: (ISchema | IOperators)[];
}

export interface IConditionalOperators {
  $cond?: ({ $if: string | ISchema | IOperators, $then: ISchema | IOperators } | { $else?: ISchema | IOperators; })[];
}

export interface IOperators
  extends
  IComparators,
  IContextuals,
  IModifiers,
  IMetaOperators,
  IStructurals,
  ILogicals,
  IConditionalOperators { }

export interface ISchema {
  [key: string]: IOperators | ISchema;
}

export interface IValidationPaths {
  localInputPath?: string;
  inputPath?: string;
}

export class ValidationContext {
  logger: Logger;
  loggerDisabled: boolean;
  currentInput: any;
  input: any;
  schema: Partial<IOperators>;
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

  get fullPath() {
    return ValidationContext.JoinPath(this.inputPath, this.localPath);
  }

  get prop() {
    return this.localPath?.split(".").pop() || "";
  }

  clone(ctx: Partial<ValidationContext>): ValidationContext {
    return new ValidationContext(Object.assign({}, this, ctx));
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