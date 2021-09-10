// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from "../";
import { ValidallError } from "../errors";

describe("Testing Schema Validations for empty or undefined schema", () => {

  describe('Testing on empty or undefined schema', () => {
    it("should throw error on undifned schema", () => {
      expect(() => { (new Validall(undefined)) }).toThrow(new ValidallError(<any>{}, 'expected a schema, got undefined'));
    });

    it("should not throw error on empty schema", () => {
      expect(() => { new Validall({}) }).not.toThrow();
    });
  });

  describe("Testing [$on, $before, $after] arguments check", () => {
    it('should throw error on invalid date argument', () => {
      expect(() => new Validall({ date: { $on: 's' } }))
        .toThrow(new ValidallError(<any>{}, `invalid 'Schema.$props.date.$on' date argument: (string: s)`));
    });

    it('should not throw error on valid date argument', () => {
      expect(() => new Validall({ date: { $on: '5-5-2020' } }))
        .not.toThrow();
    });
  });

  describe('Testing $ref operator argument check', () => {
    it('should throw error on broken reference', () => {
      expect(() => new Validall({ profile: { $ref: 'profileVal' } }))
        .toThrow(new ValidallError(<any>{}, `'Schema.$props.profile.$ref' reference not found: (profileVal)`));
    });

    it('should not throw error on healthy reference', () => {
      new Validall('profileValidator', {});

      expect(() => new Validall({ profile: { $ref: 'profileValidator' } }))
        .not.toThrow();
    });
  });

  describe("Testing $default with $type operator argument check", () => {
    it("should throw error when passing value does not match $type argument", () => {
      expect(() => new Validall({ name: { $type: 'string', $default: 5 } }))
        .toThrow(new ValidallError(<any>{}, `invalid 'Schema.$props.name.$default' argument type: (number: 5), expected to be of type (string)`))
    });

    it("should not throw error when passing value matchs $type argument", () => {
      expect(() => new Validall({ name: { $type: 'string', $default: 'Ammar' } }))
        .not.toThrow()
    });
  });

  describe("Testing [$strict, $filter] schema requiring $props operator", () => {
    it("should throw error when used without $props operator", () => {
      expect(() => new Validall({ name: { $filter: true } }))
        .toThrow(new ValidallError(<any>{}, `'Schema.$props.name.$filter' requires a sibling '$props' operator`));
    });
    
    it("should not throw error when used with $props operator", () => {
      expect(() => new Validall({ name: { $filter: true, $props: {} } }))
        .not.toThrow();
    });
  });

  describe("Testing number operators schema arguments", () => {
    it("should add $type of number", () => {
      let v = new Validall({ age: { $gt: 12 } });
      
      expect(v.schema.$props.age.$type).toBe('number');
    });
  });

  describe("Testing parenting object operators schema arguments", () => {
    it('should add $type of object', () => {
      let v = new Validall({ age: { $gt: 12 } });
      
      expect(v.schema.$type).toBe('object');
    });
  });

  describe("testing parenting operaotrs schema arguemnts", () => {
    it("[$each, $length] should add $type array", () => {
      let v = new Validall({ items: { $length: { $gt: 5 } } });

      expect(v.schema.$props.items.$type).toBe("array");
    });

    it("[$map, $keys, $size] should add $type object", () => {
      let v = new Validall({ items: { $size: { $gt: 5 } } });

      expect(v.schema.$props.items.$type).toBe("object");
    });
  });

});