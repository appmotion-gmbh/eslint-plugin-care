const RuleTester = require('eslint').RuleTester;
const rule = require('../rules/jsx-multiline-props');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-multiline-props', rule, {
    valid: [{
        code: '<div propA="valueA" />',
    }, {
        code: `
            <div
                propA="valueA"
                propB="valueB"
            />
        `,
    }, {
        code: `
            <div
                propA={
                    multilineValue
                }
            />
        `,
    }],
    invalid: [{
        code: `
            <div
                propA="valueA"
            />
        `,
        output: `
            <div propA="valueA" />
        `,
        errors: [{
            messageId: 'singlePropMultiline',
        }],
    }, {
        code: `
            <div propA={
                multilineValue
            }
            />
        `,
        output: `
            <div
        propA={
                multilineValue
            }
    />
        `,
        errors: [{
            messageId: 'singleMultilineProp',
        }],
    }, {
        code: `
            <div
                propA={
                    multilineValue
                } />
        `,
        output: `
            <div
        propA={
                    multilineValue
                }
    />
        `,
        errors: [{
            messageId: 'singleMultilineProp',
        }],
    }, {
        code: `
            <SomeContext.Provider
                propA="valueA"
            >
                {someContent}
            </SomeContext.Provider>
        `,
        output: `
            <SomeContext.Provider propA="valueA">
                {someContent}
            </SomeContext.Provider>
        `,
        errors: [{
            messageId: 'singlePropMultiline',
        }],
    }],
});
