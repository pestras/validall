import { Validall } from "../../..";

describe("Testing $paths operator", () => {

  let schema = new Validall({
    $paths: {
      'family.wife.name': { $type: 'string' }
    }
  });

  it("should return true", () => {
    expect(schema.validate({ family: { wife: { name: 'Hafoos' } } })).toBe(true);
  });

  it("should return false with proper message error", () => {
    expect(schema.validate({ family: { wife: { name: 5 } } })).toBe(false);
    expect(schema.error.message)
      .toBe("'family.wife.name' must be of type 'string', got: (number, 5)");
  });
});