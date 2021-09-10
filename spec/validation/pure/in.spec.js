"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing $in operators", () => {
    let schema = new __1.Validall({
        roles: { $in: ['admin', 'author', 'viewer'] }
    });
    it("should return true", () => {
        let me = { roles: ['author', 'viewer'] };
        expect(schema.validate(me)).toBe(true);
    });
    it("should return false and output the proper error message", () => {
        let me = { roles: ['supervisor', 'viewer'] };
        expect(schema.validate(me)).toBe(false);
        expect(schema.error.message)
            .toEqual("'roles' must not have any value out of [admin,author,viewer], got: (supervisor)");
    });
});
//# sourceMappingURL=in.spec.js.map