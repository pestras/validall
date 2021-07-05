"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
describe("Testing $ref operator", () => {
    new __1.Validall('Article', {
        title: { $type: 'string' },
        content: { $type: 'string' },
        createDate: { $is: 'date' }
    });
    let schema = new __1.Validall({
        author: { $type: 'string' },
        article: { $ref: 'Article' }
    });
    it('should return true', () => {
        expect(schema.validate({
            author: 'Ammar Mourad',
            article: {
                title: 'Article Title',
                content: 'Article content',
                createDate: new Date()
            }
        }))
            .toBe(true);
    });
    it('should return false with proper error message', () => {
        expect(schema.validate({
            author: 'Ammar Mourad',
            article: {
                title: 123,
                content: 'Article content',
                createDate: new Date()
            }
        }))
            .toBe(false);
        expect(schema.error.message)
            .toBe("'article.title' must be of type 'string', got: (number, 123)");
    });
});
//# sourceMappingURL=ref.spec.js.map