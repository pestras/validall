"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $paths operator", () => {
    let schema = new __1.Validall({
        $paths: {
            'family.wife.name': { $type: 'string' }
        }
    });
    it("should return true", () => {
        expect(schema.validate({ family: { wife: { name: 'Hafoos' } } })).toBe(true);
    });
    it("should return false with proper message error", () => {
        expect(schema.validate({ family: { wife: { name: 5 } } })).toBe(false);
        expect(schema.error.message)
            .toBe("'family.wife.name' must be of type 'string', got: (number, 5)");
    });
});
//# sourceMappingURL=paths.spec.js.map