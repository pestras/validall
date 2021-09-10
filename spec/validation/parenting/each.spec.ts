// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from "../../..";

describe("Testing $each operator", () => {

  let schema = new Validall({
    items: {
      $each: { $type: 'string' }
    }
  });

  it("should return true", () => {
    expect(schema.validate({ items: ["item 1", "item 2"] })).toBe(true);
  });

  it("should return false with proper message error", () => {
    expect(schema.validate({ items: ["item 1", 5] })).toBe(false);
    expect(schema.error.message)
      .toBe("'items[1]' must be of type 'string', got: (number, 5)");
  });
});