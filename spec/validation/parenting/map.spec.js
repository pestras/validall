"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $map operator", () => {
    let schema = new __1.Validall({
        items: {
            $map: { $type: 'string' }
        }
    });
    it("should return true", () => {
        expect(schema.validate({ items: { item1: 'item 1', item2: 'item 2' } })).toBe(true);
    });
    it("should return false with proper message error", () => {
        expect(schema.validate({ items: { item1: 'item 1', item2: 5 } })).toBe(false);
        expect(schema.error.message)
            .toBe("'items.item2' must be of type 'string', got: (number, 5)");
    });
});
//# sourceMappingURL=map.spec.js.map