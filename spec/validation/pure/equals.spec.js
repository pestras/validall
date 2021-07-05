"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing [$equals, $equalsRef] operators", () => {
    describe("Testing $equals operator", () => {
        let schema = new __1.Validall({
            name: { $equals: 'Ammar' }
        });
        it("should return true", () => {
            let me = { name: 'Ammar' };
            expect(schema.validate(me)).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let me = { name: "Ghassen" };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toEqual("'name' must equal 'Ammar', got: (string, 'Ghassen')");
        });
    });
    describe("Testing $equalsRef operator", () => {
        let schema = new __1.Validall({
            name: {},
            username: { $equalsRef: 'name' }
        });
        it("should return true", () => {
            let me = { name: 'Ammar', username: 'Ammar' };
            expect(schema.validate(me)).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let me = { name: 'Ammar', username: 'Ghassen' };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toEqual("'username' must equal 'Ammar', got: (string, 'Ghassen')");
        });
    });
});
//# sourceMappingURL=equals.spec.js.map