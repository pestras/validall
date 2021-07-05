import { Validall } from "../../..";

describe("Testing $or operator", () => {

  let schema = new Validall({
    role: { $or: [{ $equals: 'admin' }, { $equals: 'author' }] }
  });

  it("should return true", () => {
    expect(schema.validate({ role: 'admin' })).toBe(true);
  });

  it("should return false with proper error message", () => {
    expect(schema.validate({ role: 'viewer' })).toBe(false);
    expect(schema.error.message)
      .toBe("'role' failed all validations");
  });

});