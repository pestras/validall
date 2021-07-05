import { Validall } from "../.."

describe("Test validall conditional operators", () => {

  let schema = new Validall({
    group: {
      $cond: [
        { $if: { $props: { role: { $equals: 'admin' } } }, $then: { $equals: 'admins' } },
        { $if: { $props: { role: { $equals: 'author' } } }, $then: { $equals: 'authors' } },
        { $else: { $equals: 'viewers' } }
      ]
    }
  });

  it('should return true', () => {
    expect(schema.validate({ role: 'admin', group: 'admins' })).toBe(true);
    expect(schema.validate({ role: 'author', group: 'authors' })).toBe(true);
    expect(schema.validate({ role: 'viewer', group: 'viewers' })).toBe(true);
  });

  it("should return false with proper error message when $then expression fails", () => {
    expect(schema.validate({ role: 'admin', group: 'authors' })).toBe(false);
    expect(schema.error.message)
      .toBe("'group' must equal 'admins', got: (string, 'authors')");

    expect(schema.validate({ role: 'author', group: 'admins' })).toBe(false);
    expect(schema.error.message)
      .toBe("'group' must equal 'authors', got: (string, 'admins')");
  });

  it("should return false with proper error message when $else expression fails", () => {
    expect(schema.validate({ role: 'viewer', group: 'admins' })).toBe(false);
    expect(schema.error.message)
      .toBe("'group' must equal 'viewers', got: (string, 'admins')")
  });
});