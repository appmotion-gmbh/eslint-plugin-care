const RuleTester = require('eslint').RuleTester;
const rule = require('../rules/jsx-multiline-element-newline');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-multiline-element-newline', rule, {
    valid: [{
        code: `
            <div>
                <div />
                <div />
            </div>
        `,
    }, {
        code: `
            <div>
                <div
                    propA
                    propB
                />

                <div />
            </div>
        `,
    }, {
        code: `
            <div>
                <div />

                <div
                    propA
                    propB
                />
            </div>
        `,
    }, {
        code: `
            <div>
                {/* Some comment */}
                <div
                    propA
                    propB
                />
            </div>
        `,
    }],
    invalid: [{
        code: `
            <div>
                <div
                    propA
                    propB
                />
                <div />
            </div>
        `,
        output: `
            <div>
                <div
                    propA
                    propB
                />

                <div />
            </div>
        `,
        errors: [{
            messageId: 'missingLineBreakAfter',
        }],
    }, {
        code: `
            <div>
                <div />
                <div
                    propA
                    propB
                />
            </div>
        `,
        output: `
            <div>
                <div />

                <div
                    propA
                    propB
                />
            </div>
        `,
        errors: [{
            messageId: 'missingLineBreakBefore',
        }],
    }],
});
