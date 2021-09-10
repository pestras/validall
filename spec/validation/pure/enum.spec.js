"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing $enum operators", () => {
    let schema = new __1.Validall({
        role: { $enum: ['admin', 'author', 'viewer'] }
    });
    it("should return true", () => {
        let me = { role: 'author' };
        expect(schema.validate(me)).toBe(true);
    });
    it("should return false and output the proper error message", () => {
        let me = { role: 'supervisor' };
        expect(schema.validate(me)).toBe(false);
        expect(schema.error.message)
            .toEqual("'role' must equals any value in [admin,author,viewer], got: (supervisor)");
    });
});
//# sourceMappingURL=enum.spec.js.map