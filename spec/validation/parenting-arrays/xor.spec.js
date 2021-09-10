"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $xor operator", () => {
    let schema = new __1.Validall({
        name: { $xor: [{ $type: 'string' }, { $is: 'number' }] }
    });
    it("should return true", () => {
        expect(schema.validate({ name: 'Ammar Mourad' })).toBe(true);
    });
    it("should return false with proper error message when pass more than one validation", () => {
        expect(schema.validate({ name: '123' })).toBe(false);
        expect(schema.error.message)
            .toBe("'name' has passed more then one validation: [0,1]");
    });
    it("should return false with proper error message when failing all validations", () => {
        expect(schema.validate({ name: {} })).toBe(false);
        expect(schema.error.message)
            .toBe("'name' failed all validations");
    });
});
//# sourceMappingURL=xor.spec.js.map