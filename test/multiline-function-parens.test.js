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
    }, {
        code: `
            someFunction((callbackParam) => (
                stuff()
            ));
        `,
    }, {
        code: `
            someFunction((callbackParam) => (
                stuff()
            ), param2);
        `,
    }, {
        code: `
            someFunction({
                someKey: 'someValue',
            });
        `,
    }, {
        code: `
            someFunction({
                someKey: 'someValue',
            }, param2);
        `,
    }, {
        code: `
            someFunction([
                'someValue',
            ]);
        `,
    }, {
        code: `
            someFunction([
                'someValue',
            ], param2);
        `,
    }, {
        code: `
            someFunction(\`
                templateLiteral
            \`);
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
            messageId: 'shouldBeMultiLine',
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
            messageId: 'shouldBeMultiLine',
        }],
    }, {
        code: `
            someFunction(
                param1
            );
        `,
        output: `
            someFunction(param1);
        `,
        errors: [{
            messageId: 'shouldBeSingleLine',
        }],
    }, {
        code: `
            someFunction(
                {
                    someKey: 'someValue',
                }
            );
        `,
        output: `
            someFunction({
                    someKey: 'someValue',
                });
        `,
        errors: [{
            messageId: 'shouldBeSingleLine',
        }],
    }, {
        code: `
            someFunction(some
                .multiline
                .param
            );
        `,
        output: `
            someFunction(
                            some
                .multiline
                .param
                        );
        `,
        errors: [{
            messageId: 'shouldBeMultiLine',
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
            messageId: 'shouldBeMultiLine',
        }],
    }, {
        code: `
            someFunction((callbackParam) => (
                stuff()
            ), param2, param3);
        `,
        output: `
            someFunction(
                            (callbackParam) => (
                stuff()
            ),
param2,
param3
                        );
        `,
        errors: [{
            messageId: 'shouldBeMultiLine',
        }],
    }, {
        code: `
            someFunction((callbackParam) => (
                stuff()
            ), (callbackParam) => (
                stuff()
            ));
        `,
        output: `
            someFunction(
                            (callbackParam) => (
                stuff()
            ),
(callbackParam) => (
                stuff()
            )
                        );
        `,
        errors: [{
            messageId: 'shouldBeMultiLine',
        }],
    }],
});
