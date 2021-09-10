// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from "../../..";

describe("Testing $instanceof operator", () => {

  class Article { }

  let schema = new Validall({ article: { $instanceof: Article } });

  it('should return true', () => {
    expect(schema.validate({ article: new Article() })).toBe(true);
  });

  it('should return false with proper error message', () => {
    expect(schema.validate({ article: new Date() })).toBe(false);
    expect(schema.error.message)
      .toBe("'article' must be instance of 'Article'");
  });
});