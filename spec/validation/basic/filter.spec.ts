import { Validall } from '../../..';

describe("testing $filter operator", () => {

  let schema = new Validall({
    $filter: true,
    $props: {
      items: {  }
    }
  });

  it("should return true and properties not changed", () => {
    let inv: any = { items: [] };
    expect(schema.validate(inv)).toBe(true);
    expect(inv).toEqual(jasmine.objectContaining({ items: [] }));
  });

  it("should return true and 'damaged' field filtered", () => {
    let inv: any = { items: [], damaged: [] };
    expect(schema.validate(inv)).toBe(true);
    expect(inv).not.toEqual(jasmine.objectContaining({ damaged: [] }));
  });
});