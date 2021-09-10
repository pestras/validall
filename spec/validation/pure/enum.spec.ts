// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from '../../..';

describe("testing $enum operators", () => {

  let schema = new Validall({
    role: { $enum: ['admin', 'author', 'viewer'] } 
  });

  it("should return true", () => {  
    let me: any = { role: 'author' };
    expect(schema.validate(me)).toBe(true);
  });

  it("should return false and output the proper error message", () => {  
    let me: any = { role: 'supervisor' };
    expect(schema.validate(me)).toBe(false);
    expect(schema.error.message)
      .toEqual("'role' must equals any value in [admin,author,viewer], got: (supervisor)");
  });

});