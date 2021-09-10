// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from "../..";

describe("Testing modifiers operators", () => {

  describe("Testing $to operator", () => {
    let schema = new Validall({
      name: { $to: ['trim', 'lowercase', 'capitalizeFirstAll'] }
    });

    it("should return true and modify fields correctly", () => {
      let me = { name: " ammAR mourAd " }
      expect(schema.validate(me)).toBe(true);
      expect(me.name).toBe("Ammar Mourad");
    });
  });

  describe("Testing $cast operator", () => {
    let schema = new Validall({
      active: { $cast: 'boolean' }
    });

    it("should return true and cast correctly", () => {
      let me: any = { active: "yes" }
      expect(schema.validate(me)).toBe(true);
      expect(me.active).toBe(true);
    });
  });

});