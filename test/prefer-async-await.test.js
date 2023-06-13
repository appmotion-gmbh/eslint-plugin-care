const { RuleTester } = require('eslint');
const rule = require('../rules/prefer-async-await');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('prefer-async-await', rule, {
    valid: [{
        code: `
            const func = async () => {
                await somePromise();
            };
        `,
    }, {
        code: `
            const promiseCheck = somePromise().then;
        `,
    }],
    invalid: [{
        code: `
            const func = () => (
                somePromise().then(() => {
                    someCallback();
                })
            );
        `,
        errors: [{
            messageId: 'promise',
        }],
    }],
});
