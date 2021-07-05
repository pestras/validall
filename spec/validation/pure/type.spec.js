"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $type operator", () => {
    describe("Testing string type", () => {
        let schema = new __1.Validall({ name: { $type: "string" } });
        it("should return true", () => {
            expect(schema.validate({ name: "Ammar" })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ name: 12 })).toBe(false);
            expect(schema.error.message)
                .toBe("'name' must be of type 'string', got: (number, 12)");
        });
    });
    describe("Testing number type", () => {
        let schema = new __1.Validall({ age: { $type: "number" } });
        it("should return true", () => {
            expect(schema.validate({ age: 35 })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ age: "35" })).toBe(false);
            expect(schema.error.message)
                .toBe("'age' must be of type 'number', got: (string, 35)");
        });
    });
    describe("Testing boolean type", () => {
        let schema = new __1.Validall({ passed: { $type: "boolean" } });
        it("should return true", () => {
            expect(schema.validate({ passed: true })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ passed: 1 })).toBe(false);
            expect(schema.error.message)
                .toBe("'passed' must be of type 'boolean', got: (number, 1)");
        });
    });
    describe("Testing int type", () => {
        let schema = new __1.Validall({ count: { $type: "int" } });
        it("should return true", () => {
            expect(schema.validate({ count: 1 })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ count: 1.2 })).toBe(false);
            expect(schema.error.message)
                .toBe("'count' must be of type 'int', got: (number,float,primitive,any, 1.2)");
        });
    });
    describe("Testing float type", () => {
        let schema = new __1.Validall({ count: { $type: "float" } });
        it("should return true", () => {
            expect(schema.validate({ count: 1.2 })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ count: 1 })).toBe(false);
            expect(schema.error.message)
                .toBe("'count' must be of type 'float', got: (number,int,primitive,any, 1)");
        });
    });
    describe("Testing date type", () => {
        let schema = new __1.Validall({ birthdate: { $type: "date" } });
        it("should return true", () => {
            expect(schema.validate({ birthdate: new Date })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ birthdate: 1 })).toBe(false);
            expect(schema.error.message)
                .toBe("'birthdate' must be of type 'date', got: (number, 1)");
        });
    });
    describe("Testing function type", () => {
        let schema = new __1.Validall({ handler: { $type: "function" } });
        it("should return true", () => {
            expect(schema.validate({ handler: () => { } })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ handler: 1 })).toBe(false);
            expect(schema.error.message)
                .toBe("'handler' must be of type 'function', got: (number, 1)");
        });
    });
    describe("Testing object type", () => {
        let schema = new __1.Validall({ contacts: { $type: "object" } });
        it("should return true", () => {
            expect(schema.validate({ contacts: {} })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ contacts: [] })).toBe(false);
            expect(schema.error.message)
                .toBe("'contacts' must be of type 'object', got: (array, )");
        });
    });
    describe("Testing array type", () => {
        let schema = new __1.Validall({ items: { $type: "array" } });
        it("should return true", () => {
            expect(schema.validate({ items: [] })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ items: "item1" })).toBe(false);
            expect(schema.error.message)
                .toBe("'items' must be of type 'array', got: (string, item1)");
        });
    });
    describe("Testing primitive type", () => {
        let schema = new __1.Validall({ prop: { $type: "primitive" } });
        it("should return true", () => {
            expect(schema.validate({ prop: true })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ prop: ["item"] })).toBe(false);
            expect(schema.error.message)
                .toBe("'prop' must be of type 'primitive', got: (array, item)");
        });
    });
    describe("Testing regexp type", () => {
        let schema = new __1.Validall({ reg: { $type: "regexp" } });
        it("should return true", () => {
            expect(schema.validate({ reg: /a/ })).toBe(true);
        });
        it("should return false with proper error message", () => {
            expect(schema.validate({ reg: "item" })).toBe(false);
            expect(schema.error.message)
                .toBe("'reg' must be of type 'regexp', got: (string, item)");
        });
    });
});
//# sourceMappingURL=type.spec.js.map