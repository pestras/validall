// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from "../../..";

describe("Testing $props operator", () => {

  let schema = new Validall({
    $props: {
      name: { $type: 'string' }
    }
  });

  it("should return true", () => {
    expect(schema.validate({ name: 'Hafoos' })).toBe(true);
  });

  it("should return false with proper message error", () => {
    expect(schema.validate({ name: 5 })).toBe(false);
    expect(schema.error.message)
      .toBe("'name' must be of type 'string', got: (number, 5)");
  });
});