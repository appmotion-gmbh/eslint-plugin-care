const { RuleTester } = require('eslint');
const rule = require('../rules/no-single-line-function-declaration');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: 'module',
    },
});

ruleTester.run('no-single-line-function-declaration', rule, {
    valid: [{
        code: `
            const func = () => {
                someCode();
            };
        `,
    }, {
        code: `
            const func = () => (
                someCode()
            );
        `,
    }, {
        code: `
            const func = () => ({
                someKey: someValue
            });
        `,
    }, {
        code: `
            const func = () => [
                someArrayItem
            ];
        `,
    }, {
        code: `
            const func = () => \`
                templateLiteral
            \`;
        `,
    }, {
        code: `
            const func = () => (
                \`templateLiteral\`
            );
        `,
    }, {
        code: `
            const func = call(() => callback());
        `,
    }, {
        code: `
            export default () => (
                someCode()
            );
        `,
    }, {
        code: `
            const funcWithSuffixOfHandler = () => () => (
                someCode()
            );
        `,
    }],
    invalid: [{
        code: `
            const func = () => someCode();
        `,
        output: `
            const func = () => (
        someCode()
    );
        `,
        errors: [{
            messageId: 'shouldBeMultiLine',
        }],
    }, {
        code: `
            const func = () => (someCode());
        `,
        output: `
            const func = () => (
        someCode()
    );
        `,
        errors: [{
            messageId: 'shouldBeMultiLine',
        }],
    }, {
        code: `
            const func = () => (
                {
                    someKey: someValue
                }
            );
        `,
        output: `
            const func = () => ({
                    someKey: someValue
                });
        `,
        errors: [{
            messageId: 'shouldBeSingleLine',
        }],
    }, {
        code: `
            const func = () => (
                [
                    someArrayItem
                ]
            );
        `,
        output: `
            const func = () => [
                    someArrayItem
                ];
        `,
        errors: [{
            messageId: 'shouldBeSingleLine',
        }],
    }, {
        code: `
            const func = () => (
                \`
                    templateLiteral
                \`
            );
        `,
        output: `
            const func = () => \`
                    templateLiteral
                \`;
        `,
        errors: [{
            messageId: 'shouldBeSingleLine',
        }],
    }, {
        code: `
            const func = () => () => (
                someCode()
            );
        `,
        output: `
            const func = () => (
        () => (
                someCode()
            )
    );
        `,
        errors: [{
            messageId: 'noHandlerSuffix',
        }],
    }, {
        code: `
            const func = () => { someCode(); };
        `,
        output: `
            const func = () => {
            someCode();
        };
        `,
        errors: [{
            messageId: 'shouldBeMultiLine',
        }],
    }, {
        code: `
            export default () => someCode();
        `,
        output: `
            export default () => (
        someCode()
    );
        `,
        errors: [{
            messageId: 'shouldBeMultiLine',
        }],
    }, {
        code: `
            list.map((item) => someFunc(() => {
                someCode();
            }));
        `,
        output: `
            list.map((item) => (
        someFunc(() => {
                someCode();
            })
    ));
        `,
        errors: [{
            messageId: 'shouldBeMultiLine',
        }],
    }],
});
