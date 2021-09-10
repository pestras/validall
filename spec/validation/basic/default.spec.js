"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing $default operator", () => {
    describe("Texting normal defaults", () => {
        let schema = new __1.Validall({
            name: { $default: "Ammar" }
        });
        it("should return true and 'name' field equals the default value", () => {
            let me = {};
            expect(schema.validate(me)).toBe(true);
            expect(me.name).toBe("Ammar");
        });
        it("should return true and 'name' field not modified", () => {
            let me = { name: 'Ghassen' };
            expect(schema.validate(me)).toBe(true);
            expect(me.name).toBe("Ghassen");
        });
    });
    describe("Texting reference defaults", () => {
        let schema = new __1.Validall({
            username: { $type: 'string', $default: "$name" }
        });
        it("should return true and 'username' field equals the default reference value", () => {
            let me = { name: 'ammar' };
            expect(schema.validate(me)).toBe(true);
            expect(me.username).toBe("ammar");
        });
        it("should return false with error message about undefined reference", () => {
            let me = {};
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toBe("undefined reference '$name passed to 'username'");
        });
        it("should return false with error message about invalid reference type", () => {
            let me = { name: 15486 };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toBe("invalid reference type '$name passed to 'username'");
        });
    });
});
//# sourceMappingURL=default.spec.js.map