"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
describe("testing $default operator", () => {
    let schema = new index_1.Validall({
        $props: {
            name: { $default: "Ammar" }
        }
    });
    it("should return true", () => {
        expect(schema.vaildate({ name: "" })).toBe(true);
    });
    it("should 'name' equals the default value", () => {
        let me = { name: "" };
        schema.vaildate(me);
        expect(me.name).toBe("Ammar");
    });
});
//# sourceMappingURL=default.spec.js.map