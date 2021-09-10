// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from '../../..';

describe("testing $in operators", () => {

  let schema = new Validall({
    roles: { $in: ['admin', 'author', 'viewer'] } 
  });

  it("should return true", () => {  
    let me: any = { roles: ['author', 'viewer'] };
    expect(schema.validate(me)).toBe(true);
  });

  it("should return false and output the proper error message", () => {  
    let me: any = { roles: ['supervisor', 'viewer'] };
    expect(schema.validate(me)).toBe(false);
    expect(schema.error.message)
      .toEqual("'roles' must not have any value out of [admin,author,viewer], got: (supervisor)");
  });

});