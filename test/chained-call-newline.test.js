const { RuleTester } = require('eslint');
const rule = require('../rules/chained-call-newline');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('chained-call-newline', rule, {
    valid: [{
        code: `
            const foo = a.b.c();
        `,
    }, {
        code: `
            const foo = a.b.c().d().e();
        `,
    }, {
        code: `
            const foo = a
                .b
                .c()
                .d()
                .e();
        `,
    }, {
        code: `
            const foo = a
                .b
                .c();
        `,
    }, {
        code: `
            const foo = a
                .b()
                .c
                .d()
                .e();
        `,
    }, {
        code: `
            const foo = a.b
                .c()
                .d()
                .e();
        `,
    }, {
        code: `
            const foo = a.b.c(() => (
                multiline()
            ));
        `,
    }, {
        code: `
            const foo = a
                .b
                .c(() => (
                    multiline()
                ))
                .d()
                .e();
        `,
    }, {
        code: `
            const foo = a
                .b
                .c(() => (
                    multiline()
                ))
                .d()
                .e(() => (
                    multiline()
                ));
        `,
    }, {
        code: `
            const foo = Object.entries(foo).a(() => (
                multiline()
            ));
        `,
    }, {
        code: `
            const foo = Array(3).fill(null).map(() => (
                multiline()
            ));
        `,
    }, {
        code: `
            const foo = [
                item
            ].call();
        `,
    }],
    invalid: [{
        code: `
            const foo = a.b
                .c()
                .d().e();
        `,
        output: `
            const foo = a.b
                .c()
                .d()
.e();
        `,
        errors: [{
            messageId: 'separate',
        }],
    }, {
        code: `
            const foo = a.b.c(() => (
                multiline()
            )).d().e();
        `,
        output: `
            const foo = a.b
.c(() => (
                multiline()
            ))
.d()
.e();
        `,
        errors: [{
            messageId: 'separate',
        }],
    }, {
        code: `
            const foo = a.b
                .c(() => (
                    multiline()
                )).d()
                .e();
        `,
        output: `
            const foo = a.b
                .c(() => (
                    multiline()
                ))
.d()
                .e();
        `,
        errors: [{
            messageId: 'separate',
        }],
    }, {
        code: `
            const foo = a
                .b().c
                .d()
                .e();
        `,
        output: `
            const foo = a
                .b()
.c
                .d()
                .e();
        `,
        errors: [{
            messageId: 'separate',
        }],
    }, {
        code: `
            const foo = a
                .b().c(() => (
                    multiline()
                ));
        `,
        output: `
            const foo = a
                .b()
.c(() => (
                    multiline()
                ));
        `,
        errors: [{
            messageId: 'separate',
        }],
    }, {
        code: `
            const foo = a().b
                .c();
        `,
        output: `
            const foo = a()
.b
                .c();
        `,
        errors: [{
            messageId: 'separate',
        }],
    }, {
        code: `
            const foo = a.b
                .c();
        `,
        output: `
            const foo = a.b.c();
        `,
        errors: [{
            messageId: 'together',
        }],
    }],
});
