"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $not operator", () => {
    let schema = new __1.Validall({
        age: { $not: { $equals: 25 } }
    });
    it("should return true", () => {
        expect(schema.validate({ age: 27 })).toBe(true);
    });
    it("should return false with proper message error", () => {
        expect(schema.validate({ age: 25 })).toBe(false);
        expect(schema.error.message)
            .toBe("'age' must not equal '25'");
    });
});
//# sourceMappingURL=not.spec.js.map