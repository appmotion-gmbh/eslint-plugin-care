const { RuleTester } = require('eslint');
const rule = require('../rules/jsx-root-newline');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-root-newline', rule, {
    valid: [{
        code: `
            const foo = (
                <div />
            );
        `,
    }, {
        code: `
            const func = () => {
                return (
                    <div />
                );
            };
        `,
    }, {
        code: `
            const func = () => (
                <div />
            );
        `,
    }],
    invalid: [{
        code: `
            const foo = <div />;
        `,
        output: `
            const foo = (
<div />
);
        `,
        errors: [{
            messageId: 'rootNewline',
        }],
    }, {
        code: `
            const func = () => <div />;
        `,
        output: `
            const func = () => (
<div />
);
        `,
        errors: [{
            messageId: 'rootNewline',
        }],
    }, {
        code: `
            const func = () => {
                return <div />;
            };
        `,
        output: `
            const func = () => {
                return (
<div />
);
            };
        `,
        errors: [{
            messageId: 'rootNewline',
        }],
    }],
});
