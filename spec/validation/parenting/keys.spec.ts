import { Validall } from "../../..";

describe("Testing $keys operator", () => {

  let schema = new Validall({
    properties: {
      $keys: { $in: ['name', 'value'] }
    }
  });

  it("should return true", () => {
    expect(schema.validate({ properties: { name: 'style', value: 'display: block' } })).toBe(true);
  });

  it("should return false with proper message error", () => {
    expect(schema.validate({ properties: { name: 'style', values: 'display: block' } })).toBe(false);
    expect(schema.error.message)
      .toBe("'properties' must not have any property out of [name,value], got: (values)");
  });
});