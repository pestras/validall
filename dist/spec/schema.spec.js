"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
describe("testing Schema Validations", () => {
    it("should not through on empty schema", () => {
        expect(() => { new __1.Validall({}); }).not.toThrow();
    });
});
//# sourceMappingURL=schema.spec.js.map