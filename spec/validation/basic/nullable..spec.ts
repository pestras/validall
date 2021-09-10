// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from '../../..';

describe("testing $nullable operator", () => {

  let schema = new Validall({
    items: { $nullable: true }
  });
  
  it("should return true", () => {
    let inv: any = { items: null };
    expect(schema.validate(inv)).toBe(true);
  });
  
  it("should return true and 'items' field equlas to null", () => {
    let inv: any = {};
    expect(schema.validate(inv)).toBe(true);
    expect(inv.items).toBe(null);
  });
  
  it("should return true and 'items' field not modified", () => {
    let inv: any = { items: ['pc'] };
    expect(schema.validate(inv)).toBe(true);
    expect(inv.items).toContain('pc');
  });
});