"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $or operator", () => {
    let schema = new __1.Validall({
        role: { $or: [{ $equals: 'admin' }, { $equals: 'author' }] }
    });
    it("should return true", () => {
        expect(schema.validate({ role: 'admin' })).toBe(true);
    });
    it("should return false with proper error message", () => {
        expect(schema.validate({ role: 'viewer' })).toBe(false);
        expect(schema.error.message)
            .toBe("'role' failed all validations");
    });
});
//# sourceMappingURL=or.spec.js.map