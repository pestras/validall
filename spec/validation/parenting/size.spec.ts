import { Validall } from "../../..";

describe("Testing $size operator", () => {

  let schema = new Validall({
    properties: { $size: { $gt: 1 } },
    items: { $size: 2 }
  });

  it("should return true", () => {
    expect(schema.validate({
      properties: { name: 'style', value: '' },
      items: { name: 'style', value: '' },
    })).toBe(true);
  });

  it("should return false with proper message error", () => {
    expect(schema.validate({ properties: { name: 'style' } })).toBe(false);
    expect(schema.error.message)
      .toBe("'properties' size must be greater than 1, got: 1");
  });

  it("should return false with proper message error", () => {
    expect(schema.validate({ items: { name: 'style' } })).toBe(false);
    expect(schema.error.message)
      .toBe("'items' size must be 2, got: 1");
  });
});