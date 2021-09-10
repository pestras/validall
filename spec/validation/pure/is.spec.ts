// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from "../../..";

describe("Testing $is operator", () => {

  describe("Testing is name option", () => {
    let schema = new Validall({ name: { $is: "name" } });

    it("should return true", () => {
      expect(schema.validate({ name: "Ammar Mourad" })).toBe(true);
    });

    it("should return false with proper error message", () => {
      expect(schema.validate({ name: "Ammar 123" })).toBe(false);
      expect(schema.error.message)
        .toBe("'name' must include only alphabetical characters, got: (Ammar 123)");
    });
  });

  describe("Testing is notEmpty option", () => {
    let schema = new Validall({ items: { $is: "notEmpty" } });

    it("should return true", () => {
      expect(schema.validate({ items: ["item 01"] })).toBe(true);
    });

    it("should return false with proper error message", () => {
      expect(schema.validate({ items: [] })).toBe(false);
      expect(schema.error.message)
        .toBe("'items' must be not empty, got: ()");
    });
  });

  describe("Testing is number option", () => {
    let schema = new Validall({ mobile: { $is: "number" } });

    it("should return true", () => {
      expect(schema.validate({ mobile: "33484678" })).toBe(true);
    });

    it("should return false with proper error message", () => {
      expect(schema.validate({ mobile: "a5786d884" })).toBe(false);
      expect(schema.error.message)
        .toBe("'mobile' must include only numbers, got: (a5786d884)");
    });
  });

  describe("Testing is date option", () => {
    let schema = new Validall({ birthdate: { $is: "date" } });

    it("should return true", () => {
      expect(schema.validate({ birthdate: "12-1-2020" })).toBe(true);
    });

    it("should return false with proper error message", () => {
      expect(schema.validate({ birthdate: "a5786d884" })).toBe(false);
      expect(schema.error.message)
        .toBe("'birthdate' must be a valid date, got: (a5786d884)");
    });
  });

  describe("Testing is email option", () => {
    let schema = new Validall({ email: { $is: "email" } });

    it("should return true", () => {
      expect(schema.validate({ email: "me@there.com" })).toBe(true);
    });

    it("should return false with proper error message", () => {
      expect(schema.validate({ email: "me.there" })).toBe(false);
      expect(schema.error.message)
        .toBe("'email' must be a valid email, got: (me.there)");
    });
  });

  describe("Testing is url option", () => {
    let schema = new Validall({ website: { $is: "url" } });

    it("should return true", () => {
      expect(schema.validate({ website: "http://me.com" })).toBe(true);
    });

    it("should return false with proper error message", () => {
      expect(schema.validate({ website: "me.there" })).toBe(false);
      expect(schema.error.message)
        .toBe("'website' must be a valid url, got: (me.there)");
    });
  });
});