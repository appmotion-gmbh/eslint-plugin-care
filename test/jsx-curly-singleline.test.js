const { RuleTester } = require('eslint');
const rule = require('../rules/jsx-curly-singleline');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-curly-singleline', rule, {
    valid: [{
        code: `
            <div>
                {someExpression}
            </div>
        `,
    }, {
        code: `
            <div
                someKey={
                    someValue
                }
            />
        `,
    }],
    invalid: [{
        code: `
            <div>
                {
                    someExpression
                }
            </div>
        `,
        output: `
            <div>
                {someExpression}
            </div>
        `,
        errors: [{
            messageId: 'curlyMultiline',
        }],
    }],
});
