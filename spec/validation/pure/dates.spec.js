"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing date operators [$on, $onRef, $before, $beforeRef, $after, $afterRef]", () => {
    /**
     * $on
     * -----------------------------------------------------------------------------
     */
    describe("testing $on operators", () => {
        let schema = new __1.Validall({
            createDate: { $on: new Date(2020, 8, 6) }
        });
        it("should all return true", () => {
            expect(schema.validate({ createDate: new Date(2020, 8, 6) })).toBe(true);
            expect(schema.validate({ createDate: '9-6-2020' })).toBe(true);
            expect(schema.validate({ createDate: 1599339600000 })).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let post = { createDate: new Date(2020, 9, 6) };
            expect(schema.validate(post)).toBe(false);
            expect(schema.error.message)
                .toEqual("'createDate' must be on date: '9/6/2020, 12:00:00 AM', got: (10/6/2020, 12:00:00 AM)");
        });
    });
    describe("testing $onRef operators", () => {
        let schema = new __1.Validall({
            createDate: { $onRef: 'date' }
        });
        it("should all return true", () => {
            expect(schema.validate({ createDate: new Date(2020, 8, 6), date: '9-6-2020' })).toBe(true);
            expect(schema.validate({ createDate: '9-6-2020', date: '9-6-2020' })).toBe(true);
            expect(schema.validate({ createDate: 1599339600000, date: '9-6-2020' })).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let post = { createDate: new Date(2020, 11, 6), date: '9-6-2020' };
            expect(schema.validate(post)).toBe(false);
            expect(schema.error.message)
                .toEqual("'createDate' must be on date: '9/6/2020, 12:00:00 AM', got: (12/6/2020, 12:00:00 AM)");
        });
    });
    /**
     * $before
     * -----------------------------------------------------------------------------
     */
    describe("testing $on operators", () => {
        let schema = new __1.Validall({
            createDate: { $before: new Date(2020, 8, 6) }
        });
        it("should all return true", () => {
            expect(schema.validate({ createDate: new Date(2020, 7, 6) })).toBe(true);
            expect(schema.validate({ createDate: '8-6-2020' })).toBe(true);
            expect(schema.validate({ createDate: 1598339600000 })).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let post = { createDate: new Date(2020, 10, 6) };
            expect(schema.validate(post)).toBe(false);
            expect(schema.error.message)
                .toEqual("'createDate' must be before date: '9/6/2020, 12:00:00 AM', got: (11/6/2020, 12:00:00 AM)");
        });
    });
    describe("testing $beforeRef operators", () => {
        let schema = new __1.Validall({
            createDate: { $beforeRef: 'date' }
        });
        it("should all return true", () => {
            expect(schema.validate({ createDate: new Date(2020, 7, 6), date: '9-6-2020' })).toBe(true);
            expect(schema.validate({ createDate: '8-6-2020', date: '9-6-2020' })).toBe(true);
            expect(schema.validate({ createDate: 1598339600000, date: '9-6-2020' })).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let post = { createDate: new Date(2020, 10, 6), date: '9-6-2020' };
            expect(schema.validate(post)).toBe(false);
            expect(schema.error.message)
                .toEqual("'createDate' must be before date: '9/6/2020, 12:00:00 AM', got: (11/6/2020, 12:00:00 AM)");
        });
    });
    /**
     * $after
     * -----------------------------------------------------------------------------
     */
    describe("testing $after operators", () => {
        let schema = new __1.Validall({
            createDate: { $after: new Date(2020, 8, 6) }
        });
        it("should all return true", () => {
            expect(schema.validate({ createDate: new Date(2020, 9, 6) })).toBe(true);
            expect(schema.validate({ createDate: '10-6-2020' })).toBe(true);
            expect(schema.validate({ createDate: 1599439600000 })).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let post = { createDate: new Date(2020, 7, 6) };
            expect(schema.validate(post)).toBe(false);
            expect(schema.error.message)
                .toEqual("'createDate' must be after date: '9/6/2020, 12:00:00 AM', got: (8/6/2020, 12:00:00 AM)");
        });
    });
    describe("testing $afterRef operators", () => {
        let schema = new __1.Validall({
            createDate: { $afterRef: 'date' }
        });
        it("should all return true", () => {
            expect(schema.validate({ createDate: new Date(2020, 9, 6), date: '9-6-2020' })).toBe(true);
            expect(schema.validate({ createDate: '10-6-2020', date: '9-6-2020' })).toBe(true);
            expect(schema.validate({ createDate: 1599439600000, date: '9-6-2020' })).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let post = { createDate: new Date(2020, 7, 6), date: '9-6-2020' };
            expect(schema.validate(post)).toBe(false);
            expect(schema.error.message)
                .toEqual("'createDate' must be after date: '9/6/2020, 12:00:00 AM', got: (8/6/2020, 12:00:00 AM)");
        });
    });
});
// 'createDate' must be on date: '9/6/2020', 12:00:00 AM, got: (12/6/2020, 12:00:00 AM)
// 'createDate' must be on date: '9/6/2020', 12:00:00 AM', got: (12/6/2020, 12:00:00 AM)
//# sourceMappingURL=dates.spec.js.map