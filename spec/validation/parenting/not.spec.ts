import { Validall } from "../../..";

describe("Testing $not operator", () => {

  let schema = new Validall({
    age: { $not: { $equals: 25 } }
  });

  it("should return true", () => {
    expect(schema.validate({ age: 27 })).toBe(true);
  });

  it("should return false with proper message error", () => {
    expect(schema.validate({ age: 25 })).toBe(false);
    expect(schema.error.message)
      .toBe("'age' must not equal '25'");
  });
});