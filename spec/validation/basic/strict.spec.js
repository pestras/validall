"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing $strict operator", () => {
    let schema = new __1.Validall({
        $strict: true,
        $props: {
            items: {}
        }
    });
    it("should return true", () => {
        let inv = { items: [] };
        expect(schema.validate(inv)).toBe(true);
    });
    it("should throw error when not defined field was found", () => {
        let inv = { items: [], damaged: [] };
        expect(schema.validate(inv)).toBe(false);
        expect(schema.error.message).toEqual("'damaged' field is not allowed");
    });
});
//# sourceMappingURL=strict.spec.js.map