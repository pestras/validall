"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing $filter operator", () => {
    let schema = new __1.Validall({
        $filter: true,
        $props: {
            items: {}
        }
    });
    it("should return true and properties not changed", () => {
        let inv = { items: [] };
        expect(schema.validate(inv)).toBe(true);
        expect(inv).toEqual(jasmine.objectContaining({ items: [] }));
    });
    it("should return true and 'damaged' field filtered", () => {
        let inv = { items: [], damaged: [] };
        expect(schema.validate(inv)).toBe(true);
        expect(inv).not.toEqual(jasmine.objectContaining({ damaged: [] }));
    });
});
//# sourceMappingURL=filter.spec.js.map