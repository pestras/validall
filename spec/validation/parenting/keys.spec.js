"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $keys operator", () => {
    let schema = new __1.Validall({
        properties: {
            $keys: { $in: ['name', 'value'] }
        }
    });
    it("should return true", () => {
        expect(schema.validate({ properties: { name: 'style', value: 'display: block' } })).toBe(true);
    });
    it("should return false with proper message error", () => {
        expect(schema.validate({ properties: { name: 'style', values: 'display: block' } })).toBe(false);
        expect(schema.error.message)
            .toBe("'properties' must not have any property out of [name,value], got: (values)");
    });
});
//# sourceMappingURL=keys.spec.js.map