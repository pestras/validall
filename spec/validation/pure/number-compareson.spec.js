"use strict";
// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("testing [$gt, $gtRef, $gte, $gteRef, $lt, $ltRef, $lte, $lteRef] operators", () => {
    /**
     * $gt, $gtRef
     * -------------------------------------------------------------------------------
     */
    describe("Testing $gt operator", () => {
        let schema = new __1.Validall({
            age: { $gt: 23 }
        });
        it("should return true", () => {
            let me = { age: 25 };
            expect(schema.validate(me)).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let me = { age: 23 };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toEqual("'age' value must be greater than 23, got: 23");
        });
    });
    describe("Testing $gtRef operator", () => {
        let schema = new __1.Validall({
            limit: {},
            age: { $gtRef: 'limit' }
        });
        it("should return true", () => {
            let me = { limit: 23, age: 25 };
            expect(schema.validate(me)).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let me = { limit: 23, age: 23 };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toEqual("'age' value must be greater than 23, got: 23");
        });
    });
    /**
     * $gte, $gteRef
     * -------------------------------------------------------------------------------
     */
    describe("Testing $gte operator", () => {
        let schema = new __1.Validall({
            age: { $gte: 23 }
        });
        it("should return true", () => {
            let me = { age: 23 };
            expect(schema.validate(me)).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let me = { age: 20 };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toEqual("'age' value must be greater than or equals to 23, got: 20");
        });
    });
    describe("Testing $gteRef operator", () => {
        let schema = new __1.Validall({
            limit: {},
            age: { $gteRef: 'limit' }
        });
        it("should return true", () => {
            let me = { limit: 23, age: 23 };
            expect(schema.validate(me)).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let me = { limit: 23, age: 20 };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toEqual("'age' value must be greater than or equals to 23, got: 20");
        });
    });
    /**
     * $lt, $ltRef
     * -------------------------------------------------------------------------------
     */
    describe("Testing $lt operator", () => {
        let schema = new __1.Validall({
            age: { $lt: 23 }
        });
        it("should return true", () => {
            let me = { age: 20 };
            expect(schema.validate(me)).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let me = { age: 23 };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toEqual("'age' value must be less than 23, got: 23");
        });
    });
    describe("Testing $ltRef operator", () => {
        let schema = new __1.Validall({
            limit: {},
            age: { $ltRef: 'limit' }
        });
        it("should return true", () => {
            let me = { limit: 23, age: 20 };
            expect(schema.validate(me)).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let me = { limit: 23, age: 23 };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toEqual("'age' value must be less than 23, got: 23");
        });
    });
    /**
     * $lte, $lteRef
     * -------------------------------------------------------------------------------
     */
    describe("Testing $lte operator", () => {
        let schema = new __1.Validall({
            age: { $lte: 23 }
        });
        it("should return true", () => {
            let me = { age: 23 };
            expect(schema.validate(me)).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let me = { age: 25 };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toEqual("'age' value must be less than or equals to 23, got: 25");
        });
    });
    describe("Testing $lteRef operator", () => {
        let schema = new __1.Validall({
            limit: {},
            age: { $lteRef: 'limit' }
        });
        it("should return true", () => {
            let me = { limit: 23, age: 23 };
            expect(schema.validate(me)).toBe(true);
        });
        it("should return false and output the proper error message", () => {
            let me = { limit: 23, age: 25 };
            expect(schema.validate(me)).toBe(false);
            expect(schema.error.message)
                .toEqual("'age' value must be less than or equals to 23, got: 25");
        });
    });
});
//# sourceMappingURL=number-compareson.spec.js.map