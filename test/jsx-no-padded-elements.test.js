const { RuleTester } = require('eslint');
const rule = require('../rules/jsx-no-padded-elements');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-no-padded-elements', rule, {
    valid: [{
        code: `
            <div>
                <div />
            </div>
        `,
    }, {
        code: `
            <div>
                Some text

                <div />
            </div>
        `,
    }, {
        code: `
            <div>
                <div />

                Some text
            </div>
        `,
    }],
    invalid: [{
        code: `
            <div>

                <div />
            </div>
        `,
        output: `
            <div>
<div />
            </div>
        `,
        errors: [{
            messageId: 'paddedElement',
        }],
    }, {
        code: `
            <div>
                <div />

            </div>
        `,
        output: `
            <div>
                <div />
</div>
        `,
        errors: [{
            messageId: 'paddedElement',
        }],
    }, {
        code: `
            <div>

                Some text

                <div />
            </div>
        `,
        output: `
            <div>
Some text

                <div />
            </div>
        `,
        errors: [{
            messageId: 'paddedElement',
        }],
    }, {
        code: `
            <div>
                <div />

                Some text

            </div>
        `,
        output: `
            <div>
                <div />

                Some text
</div>
        `,
        errors: [{
            messageId: 'paddedElement',
        }],
    }],
});
