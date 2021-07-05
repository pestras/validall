"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
describe("Testing custom messages with $message operator", () => {
    new __1.Validall('article', {
        title: { $type: 'string', $message: 'article title should be string' }
    });
    let schema = new __1.Validall({
        id: { $and: [{ $type: 'string' }, { $is: 'number', $message: 'invalid id' }] },
        name: { $required: true, $message: 'name is required' },
        articles: {
            $each: {
                $ref: 'article'
            }
        }
    });
    it("should return the right message", () => {
        schema.validate({});
        expect(schema.error.message).toBe("name is required");
        schema.validate({ name: 'Ammar', id: 'dfsg' });
        expect(schema.error.message).toBe("invalid id");
        schema.validate({ name: 'Ammar', id: '3253623', articles: [{ title: 55 }] });
        expect(schema.error.message).toBe("article title should be string");
    });
});
//# sourceMappingURL=message.spec.js.map