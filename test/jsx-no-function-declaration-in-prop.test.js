const { RuleTester } = require('eslint');
const rule = require('../rules/jsx-no-function-declaration-in-prop');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-no-function-declaration-in-prop', rule, {
    valid: [{
        code: `
            <div onClick={handleClick} />
        `,
    }, {
        code: `
            <div onClick={() => doSomething()} />
        `,
    }],
    invalid: [{
        code: `
            <div
                onClick={() => {
                    doSomething();
                }}
            />
        `,
        errors: [{
            messageId: 'functionDeclarationInProp',
        }],
    }],
});
