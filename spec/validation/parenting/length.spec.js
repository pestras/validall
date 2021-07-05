"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $length operator", () => {
    let schema = new __1.Validall({
        items: { $length: { $gt: 1 } },
        properties: { $length: 2 }
    });
    it("should return true", () => {
        expect(schema.validate({
            items: ['item 1', 'item 2'],
            properties: ['property 1', 'property 2'],
        })).toBe(true);
    });
    it("should return false with proper message error", () => {
        expect(schema.validate({ items: ['item 1'] })).toBe(false);
        expect(schema.error.message)
            .toBe("'items' length must be greater than 1, got: 1");
    });
    it("should return false with proper message error", () => {
        expect(schema.validate({ properties: ['item 1'] })).toBe(false);
        expect(schema.error.message)
            .toBe("'properties' length must be 2, got: 1");
    });
});
//# sourceMappingURL=length.spec.js.map