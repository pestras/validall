import { Validall } from '../../..';

describe("testing $default operator", () => {

  describe("Texting normal defaults", () => {
    let schema = new Validall({
      name: { $default: "Ammar" }
    });
    
    it("should return true and 'name' field equals the default value", () => {
      let me: any = {};
      expect(schema.validate(me)).toBe(true);
      expect(me.name).toBe("Ammar");
    });
  
    it("should return true and 'name' field not modified", () => {
      let me: any = { name: 'Ghassen'};
      expect(schema.validate(me)).toBe(true);
      expect(me.name).toBe("Ghassen");
    });
  });

  describe("Texting reference defaults", () => {
    let schema = new Validall({
      username: { $type: 'string', $default: "$name" }
    });
    
    it("should return true and 'username' field equals the default reference value", () => {
      let me: any = { name: 'ammar' };
      expect(schema.validate(me)).toBe(true);
      expect(me.username).toBe("ammar");
    });
  
    it("should return false with error message about undefined reference", () => {
      let me: any = {};
      expect(schema.validate(me)).toBe(false);
      expect(schema.error.message)
        .toBe("undefined reference '$name passed to 'username'");
    });
  
    it("should return false with error message about invalid reference type", () => {
      let me: any = { name: 15486 };
      expect(schema.validate(me)).toBe(false);
      expect(schema.error.message)
        .toBe("invalid reference type '$name passed to 'username'");
    });
  });

});