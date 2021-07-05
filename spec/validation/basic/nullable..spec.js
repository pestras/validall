"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing $nullable operator", () => {
    let schema = new __1.Validall({
        items: { $nullable: true }
    });
    it("should return true", () => {
        let inv = { items: null };
        expect(schema.validate(inv)).toBe(true);
    });
    it("should return true and 'items' field equlas to null", () => {
        let inv = {};
        expect(schema.validate(inv)).toBe(true);
        expect(inv.items).toBe(null);
    });
    it("should return true and 'items' field not modified", () => {
        let inv = { items: ['pc'] };
        expect(schema.validate(inv)).toBe(true);
        expect(inv.items).toContain('pc');
    });
});
//# sourceMappingURL=nullable..spec.js.map