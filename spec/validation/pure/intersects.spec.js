"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing $intersects operators", () => {
    let schema = new __1.Validall({
        roles: { $intersects: ['admin', 'author'] }
    });
    it("should return true", () => {
        let me = { roles: ['author', 'viewer'] };
        expect(schema.validate(me)).toBe(true);
    });
    it("should return false and output the proper error message", () => {
        let me = { roles: ['supervisor', 'viewer'] };
        expect(schema.validate(me)).toBe(false);
        expect(schema.error.message)
            .toEqual("'roles' must have at least on value with [admin,author]");
    });
});
//# sourceMappingURL=intersects.spec.js.map