const { RuleTester } = require('eslint');
const rule = require('../rules/jsx-multiline-children-newline');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-multiline-children-newline', rule, {
    valid: [{
        code: `
            <div>Test</div>
        `,
    }, {
        code: `
            <div>
                <div />
            </div>
        `,
    }, {
        code: `
            <div>
                Test

                <div />
            </div>
        `,
    }],
    invalid: [{
        code: `
            <div><div />
            </div>
        `,
        output: `
            <div>
<div />
            </div>
        `,
        errors: [{
            messageId: 'newLine',
        }],
    }, {
        code: `
            <div>Test
                <div />
            </div>
        `,
        output: `
            <div>
Test
                <div />
            </div>
        `,
        errors: [{
            messageId: 'newLine',
        }],
    }],
});
