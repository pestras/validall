// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from '../../..';

describe("testing $strict operator", () => {

  let schema = new Validall({
    $strict: true,
    $props: {
      items: {  }
    }
  });

  it("should return true", () => {
    let inv: any = { items: [] };
    expect(schema.validate(inv)).toBe(true);
  });

  it("should throw error when not defined field was found", () => {
    let inv: any = { items: [], damaged: [] };
    expect(schema.validate(inv)).toBe(false);
    expect(schema.error.message).toEqual("'damaged' field is not allowed");
  });
});