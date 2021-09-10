"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing $inRange operators", () => {
    let schema = new __1.Validall({
        age: { $inRange: [12, 25] }
    });
    it("should return true", () => {
        let me = { age: 18 };
        expect(schema.validate(me)).toBe(true);
    });
    it("should return false and output the proper error message", () => {
        let me = { age: 5 };
        expect(schema.validate(me)).toBe(false);
        expect(schema.error.message)
            .toEqual("'age' value must be in range between [12,25], got: 5");
    });
});
//# sourceMappingURL=inrange.spec.js.map