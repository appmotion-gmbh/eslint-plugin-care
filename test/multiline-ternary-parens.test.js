const RuleTester = require('eslint').RuleTester;
const rule = require('../rules/multiline-ternary-parens');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('multiline-ternary-parens', rule, {
    valid: [{
        code: 'const a = condition ? true : false;',
    }, {
        code: `
            const a = condition
                ? true
                : false;
        `,
    }, {
        code: `
            const a = condition ? (
                some
                    .multiline
                    .code()
            ) : (
                null
            );
        `,
    }, {
        code: `
            const a = condition ? (
                <div />
            ) : (
                <span />
            );
        `,
    }],
    invalid: [{
        code: `
    const a = condition
        ? some
            .multiline
            .code()
        : null;
        `,
        output: `
    const a = condition ? (
        some
            .multiline
            .code()
    ) : (
        null
    );
        `,
        errors: [{
            messageId: 'missingParentheses',
        }],
    }, {
        code: `
    const a = condition ? (
        true
    ) : (
        false
    );
        `,
        output: `
    const a = condition
        ? true
        : false;
        `,
        errors: [{
            messageId: 'superfluousParentheses',
        }],
    }, {
        code: `
    const a = condition
        ? (some
            .multiline
            .code())
        : (null);
        `,
        output: `
    const a = condition ? (
        some
            .multiline
            .code()
    ) : (
        null
    );
        `,
        errors: [{
            messageId: 'invalidParentheses',
        }],
    }, {
        code: `
    const a = condition
        ? (
            some
                .multiline
                .code()
        )
        : (
            null
        );
        `,
        output: `
    const a = condition ? (
        some
                .multiline
                .code()
    ) : (
        null
    );
        `,
        errors: [{
            messageId: 'invalidParentheses',
        }],
    }, {
        code: `
    const a = condition ?
        (
            some
                .multiline
                .code()
        )
        :
        (
            null
        );
        `,
        output: `
    const a = condition ? (
        some
                .multiline
                .code()
    ) : (
        null
    );
        `,
        errors: [{
            messageId: 'invalidParentheses',
        }],
    }, {
        code: `
    const a = condition ? (
        some
            .multiline
            .code()
    ) : (
        null);
        `,
        output: `
    const a = condition ? (
        some
            .multiline
            .code()
    ) : (
        null
    );
        `,
        errors: [{
            messageId: 'invalidParentheses',
        }],
    }, {
        code: `
    const a = condition ? (
        some
            .multiline
            .code()
    )
        : (
            null
        );
        `,
        output: `
    const a = condition ? (
        some
            .multiline
            .code()
    ) : (
        null
    );
        `,
        errors: [{
            messageId: 'invalidParentheses',
        }],
    }, {
        code: `
    const a = condition ? someCondition : (
        some
            .multiline
            .code()
    );
        `,
        output: `
    const a = condition ? (
        someCondition
    ) : (
        some
            .multiline
            .code()
    );
        `,
        errors: [{
            messageId: 'missingParentheses',
        }],
    }, {
        code: `
    const a = condition ? someCondition : (
        null
    );
        `,
        output: `
    const a = condition
        ? someCondition
        : null;
        `,
        errors: [{
            messageId: 'superfluousParentheses',
        }],
    }, {
        code: `
    const a = condition ? someCondition : (
        <div />
    );
        `,
        output: `
    const a = condition ? (
        someCondition
    ) : (
        <div />
    );
        `,
        errors: [{
            messageId: 'missingParentheses',
        }],
    }],
});
