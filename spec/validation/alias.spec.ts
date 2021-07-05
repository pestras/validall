import { Validall } from "../..";

describe("Testing $name and $alias operators", () => {
  
  let schema = new Validall({
    id: { $or: [{ $type: 'string', $name: 'stringId' }, { $type: 'number' }] },
    type: { $cond: [
      { $if: { $alias: 'stringId' }, $then: { $equals: 'document' } },
      { $else: { $equals: 'serial' } }
    ] }
  });

  it("should return true", () => {
    expect(schema.validate({ id: 'jvwbjwb032g', type: 'document' })).toBe(true);
    expect(schema.validate({ id: 1699254543, type: 'serial' })).toBe(true);
  });
});