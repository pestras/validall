import { Validall } from "../../..";

describe("Testing $and operator", () => {

  let schema = new Validall({
    name: { $and: [{ $type: 'string' }, { $is: 'name' }] }
  });

  it("should return true", () => {
    expect(schema.validate({ name: 'Ammar Mourad' })).toBe(true);
  });

  it("should return false with proper error message", () => {
    expect(schema.validate({ name: 'Ammar123' })).toBe(false);
    expect(schema.error.message)
      .toBe("'name' must include only alphabetical characters, got: (Ammar123)");
  });

});