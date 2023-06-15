const { RuleTester } = require('eslint');
const rule = require('../rules/logical-indent');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('logical-indent', rule, {
    valid: [{
        code: `
            const foo = a && b;
        `,
    }, {
        code: `
            const foo = (
                a
                && b
            )
        `,
    }, {
        code: `
            const foo = (
                a &&
                b
            )
        `,
    }, {
        code: `
            const foo = (
                a
                && (
                    b
                    || c
                )
            )
        `,
    }, {
        code: `
            const foo = (
                (
                    a
                    || b
                )
                && (
                    (
                        c
                        && d
                    )
                    || e
                )
            )
        `,
    }],
    invalid: [{
        code: `
            const foo = (
                a
            && b
            )
        `,
        output: `
            const foo = (
                a
                && b
            )
        `,
        errors: [{
            messageId: 'invalidIndent',
        }],
    }, {
        code: `
            const foo = (
                a
                    && b
            )
        `,
        output: `
            const foo = (
                a
                && b
            )
        `,
        errors: [{
            messageId: 'invalidIndent',
        }],
    }, {
        code: `
            const foo = (
                a &&
            b
            )
        `,
        output: `
            const foo = (
                a &&
                b
            )
        `,
        errors: [{
            messageId: 'invalidIndent',
        }],
    }, {
        code: `
            const foo = (
                a &&
                    b
            )
        `,
        output: `
            const foo = (
                a &&
                b
            )
        `,
        errors: [{
            messageId: 'invalidIndent',
        }],
    }, {
        code: `
            const foo = (
                a
                && (
                    b
                || c
                )
            )
        `,
        output: `
            const foo = (
                a
                && (
                    b
                    || c
                )
            )
        `,
        errors: [{
            messageId: 'invalidIndent',
        }],
    }, {
        code: `
            const foo = (
                (
                    a
                    || b
                )
                && (
                    (
                        c
                            && d
                    )
                || e
                )
            )
        `,
        output: `
            const foo = (
                (
                    a
                    || b
                )
                && (
                    (
                        c
                        && d
                    )
                    || e
                )
            )
        `,
        errors: [{
            messageId: 'invalidIndent',
        }, {
            messageId: 'invalidIndent',
        }],
    }],
});
