"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
describe("Testing $name and $alias operators", () => {
    let schema = new __1.Validall({
        id: { $or: [{ $type: 'string', $name: 'stringId' }, { $type: 'number' }] },
        type: { $cond: [
                { $if: { $alias: 'stringId' }, $then: { $equals: 'document' } },
                { $else: { $equals: 'serial' } }
            ] }
    });
    it("should return true", () => {
        expect(schema.validate({ id: 'jvwbjwb032g', type: 'document' })).toBe(true);
        expect(schema.validate({ id: 1699254543, type: 'serial' })).toBe(true);
    });
});
//# sourceMappingURL=alias.spec.js.map