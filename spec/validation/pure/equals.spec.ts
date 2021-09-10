// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from '../../..';

describe("testing [$equals, $equalsRef] operators", () => {

  describe("Testing $equals operator", () => {

    let schema = new Validall({
      name: { $equals: 'Ammar' } 
    });

    it("should return true", () => {  
      let me: any = { name: 'Ammar' };
      expect(schema.validate(me)).toBe(true);
    });
  
    it("should return false and output the proper error message", () => {  
      let me: any = { name: "Ghassen" };
      expect(schema.validate(me)).toBe(false);
      expect(schema.error.message)
        .toEqual("'name' must equal 'Ammar', got: (string, 'Ghassen')");
    });
  });

  describe("Testing $equalsRef operator", () => {

    let schema = new Validall({
      name: {},
      username: { $equalsRef: 'name' } 
    });

    it("should return true", () => {  
      let me: any = { name: 'Ammar', username: 'Ammar' };
      expect(schema.validate(me)).toBe(true);
    });
  
    it("should return false and output the proper error message", () => {  
      let me: any = { name: 'Ammar', username: 'Ghassen' };
      expect(schema.validate(me)).toBe(false);
      expect(schema.error.message)
        .toEqual("'username' must equal 'Ammar', got: (string, 'Ghassen')");
    });
  });

});