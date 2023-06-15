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
            messageId: 'singleLineFunctionDeclaration',
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
            messageId: 'singleLineFunctionDeclaration',
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
            messageId: 'singleLineFunctionDeclaration',
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
            messageId: 'singleLineFunctionDeclaration',
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
            messageId: 'singleLineFunctionDeclaration',
        }],
    }],
});
