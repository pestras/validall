// Copyright (c) 2021 Pestras
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Validall } from "../.."

describe("Testing custom messages with $message operator", () => {

  new Validall('article', {
    title: { $type: 'string', $message: 'article title should be string' }
  });

  let schema = new Validall({
    id: { $and: [{ $type: 'string' }, { $is: 'number', $message: 'invalid id' } ]},
    name: { $required: true, $message: 'name is required' },
    articles: {
      $each: {
        $ref: 'article'
      }
    }
  });

  it("should return the right message", () => {
    schema.validate({})
    expect(schema.error.message).toBe("name is required");
    
    schema.validate({ name: 'Ammar', id: 'dfsg' });
    expect(schema.error.message).toBe("invalid id");

    schema.validate({ name: 'Ammar', id: '3253623', articles: [{ title: 55 }] });
    expect(schema.error.message).toBe("article title should be string");
  })

});