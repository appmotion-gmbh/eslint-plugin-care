const { RuleTester } = require('eslint');
const rule = require('../rules/jsx-one-element-per-line');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-one-element-per-line', rule, {
    valid: [{
        code: `
            <div>
                <div>content</div>
            </div>
        `,
    }],
    invalid: [{
        code: `
            <div><div>content</div></div>
        `,
        output: `
            <div>
<div>content</div>
</div>
        `,
        errors: [{
            messageId: 'oneElementPerLine',
        }],
    }],
});
