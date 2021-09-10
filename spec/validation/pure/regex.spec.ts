// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from "../../..";

describe("Testing $regex operator", () => {

  let schema = new Validall({ password: { $regex: /[a-zA-Z0-9]{6,}/ } });

  it('should return true', () => {
    expect(schema.validate({ password: "feji80g32g" })).toBe(true);
  });

  it('should return false with proper error message', () => {
    expect(schema.validate({ password: "nvwio_8&3N" })).toBe(false);
    expect(schema.error.message)
      .toBe("'password' must match pattern '/[a-zA-Z0-9]{6,}/', got: (nvwio_8&3N)");
  });
});