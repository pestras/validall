"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $and operator", () => {
    let schema = new __1.Validall({
        name: { $and: [{ $type: 'string' }, { $is: 'name' }] }
    });
    it("should return true", () => {
        expect(schema.validate({ name: 'Ammar Mourad' })).toBe(true);
    });
    it("should return false with proper error message", () => {
        expect(schema.validate({ name: 'Ammar123' })).toBe(false);
        expect(schema.error.message)
            .toBe("'name' must include only alphabetical characters, got: (Ammar123)");
    });
});
//# sourceMappingURL=and.spec.js.map