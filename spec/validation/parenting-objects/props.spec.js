"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $props operator", () => {
    let schema = new __1.Validall({
        $props: {
            name: { $type: 'string' }
        }
    });
    it("should return true", () => {
        expect(schema.validate({ name: 'Hafoos' })).toBe(true);
    });
    it("should return false with proper message error", () => {
        expect(schema.validate({ name: 5 })).toBe(false);
        expect(schema.error.message)
            .toBe("'name' must be of type 'string', got: (number, 5)");
    });
});
//# sourceMappingURL=props.spec.js.map