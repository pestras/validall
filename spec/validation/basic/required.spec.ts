// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from '../../..';

describe("testing $required operator", () => {

  let schema = new Validall({
    name: { $required: true }
  });
  
  it("should return false and has the right error message", () => {
    let me: any = {};
    expect(schema.validate(me)).toBe(false);
    expect(schema.error.message).toBe("'name' field is required");
  });
  
  it("should return true", () => {
    let me: any = { name: "Ammar" };
    expect(schema.validate(me)).toBe(true);
  });
});