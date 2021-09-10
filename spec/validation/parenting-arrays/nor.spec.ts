// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from "../../..";

describe("Testing $nor operator", () => {

  let schema = new Validall({
    id: { $nor: [{ $type: 'date' }, { $type: 'number' }] }
  });

  it("should return true", () => {
    expect(schema.validate({ id: 'n483bobn429043' })).toBe(true);
  });

  it("should return false with proper error message when pass more than one validation", () => {
    expect(schema.validate({ id: 13541864134 })).toBe(false);
    expect(schema.error.message)
      .toBe("'id' has passed one or more validation: [1]");
  });

});