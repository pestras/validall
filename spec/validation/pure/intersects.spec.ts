import { Validall } from '../../..';

describe("testing $intersects operators", () => {

  let schema = new Validall({
    roles: { $intersects: ['admin', 'author'] } 
  });

  it("should return true", () => {  
    let me: any = { roles: ['author', 'viewer'] };
    expect(schema.validate(me)).toBe(true);
  });

  it("should return false and output the proper error message", () => {  
    let me: any = { roles: ['supervisor', 'viewer'] };
    expect(schema.validate(me)).toBe(false);
    expect(schema.error.message)
      .toEqual("'roles' must have at least on value with [admin,author]");
  });

});