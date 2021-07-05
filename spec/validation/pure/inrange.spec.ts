import { Validall } from '../../..';

describe("testing $inRange operators", () => {

  let schema = new Validall({
    age: { $inRange: [12, 25] } 
  });

  it("should return true", () => {  
    let me: any = { age: 18 };
    expect(schema.validate(me)).toBe(true);
  });

  it("should return false and output the proper error message", () => {  
    let me: any = { age: 5 };
    expect(schema.validate(me)).toBe(false);
    expect(schema.error.message)
      .toEqual("'age' value must be in range between [12,25], got: 5");
  });

});