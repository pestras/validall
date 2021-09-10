"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing $required operator", () => {
    let schema = new __1.Validall({
        name: { $required: true }
    });
    it("should return false and has the right error message", () => {
        let me = {};
        expect(schema.validate(me)).toBe(false);
        expect(schema.error.message).toBe("'name' field is required");
    });
    it("should return true", () => {
        let me = { name: "Ammar" };
        expect(schema.validate(me)).toBe(true);
    });
});
//# sourceMappingURL=required.spec.js.map