const { RuleTester } = require('eslint');
const rule = require('../rules/multiline-function-parens');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
    },
});

ruleTester.run('multiline-function-parens', rule, {
    valid: [{
        code: `
            someFunction(param1, param2, param3);
        `,
    }, {
        code: `
            someFunction(
                param1,
                param2,
                param3
            );
        `,
    }, {
        code: `
            someFunction(
                some
                    .multiline
                    .param
            );
        `,
    }],
    invalid: [{
        code: `
            someFunction(param1,
                param2, param3);
        `,
        output: `
            someFunction(
                            param1,
param2,
param3
                        );
        `,
        errors: [{
            messageId: 'invalidLineBreaks',
        }],
    }, {
        code: `
            someFunction(
                param1,
                param2, param3);
        `,
        output: `
            someFunction(
                            param1,
param2,
param3
                        );
        `,
        errors: [{
            messageId: 'invalidLineBreaks',
        }],
    }, {
        code: `
            someFunction(some
                .multiline.param, param2);
        `,
        output: `
            someFunction(
                            some
                .multiline.param,
param2
                        );
        `,
        errors: [{
            messageId: 'invalidLineBreaks',
        }],
    }],
});
