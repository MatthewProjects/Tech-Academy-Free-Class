"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cssUtils_1 = require("../../cssUtils");
const assert = require("assert");
suite('Test cssUtils', () => {
    suite('#findClassName', () => {
        test('finds \'container\' in \'.container\'', () => {
            assert.equal((0, cssUtils_1.findClassName)('.container'), 'container');
        });
        test('finds \'bg-warning\' in \'a.bg-warning:hover\'', () => {
            assert.equal((0, cssUtils_1.findClassName)('a.bg-warning:hover'), 'bg-warning');
        });
        test('finds \'u-1\\/2\' in \'.u-1\\/2\'', () => {
            assert.equal((0, cssUtils_1.findClassName)('.u-1\\/2'), 'u-1\\/2');
        });
        test('finds \'ratio-16\\:9\' in \'.ratio-16\\:9\'', () => {
            assert.equal((0, cssUtils_1.findClassName)('.ratio-16\\:9'), 'ratio-16\\:9');
        });
        test('finds \'margin\\@palm\' in \'.margin\\@palm\'', () => {
            assert.equal((0, cssUtils_1.findClassName)('.margin\\@palm'), 'margin\\@palm');
        });
    });
    suite('#sanitizeClassName', () => {
        test('sanitizes \'u-1\\/2\' to \'u-1/2\'', () => {
            assert.equal((0, cssUtils_1.sanitizeClassName)('u-1\\/2'), 'u-1/2');
        });
        test('sanitizes \'ratio-16\\:9\' to \'ratio-16:9\'', () => {
            assert.equal((0, cssUtils_1.sanitizeClassName)('ratio-16\\:9'), 'ratio-16:9');
        });
        test('sanitizes \'margin\\@palm\' to \'margin@palm\'', () => {
            assert.equal((0, cssUtils_1.sanitizeClassName)('margin\\@palm'), 'margin@palm');
        });
        test('sanitizes \'foo-1\\/2\\@bar\' to \'foo-1/2@bar\'', () => {
            assert.equal((0, cssUtils_1.sanitizeClassName)('foo-1\\/2\\@bar'), 'foo-1/2@bar');
        });
    });
});
//# sourceMappingURL=cssUtils.test.js.map