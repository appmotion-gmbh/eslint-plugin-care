const { RuleTester } = require('eslint');
const rule = require('../rules/react-component-name');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('react-component-name', rule, {
    valid: [{
        filename: 'Component.jsx',
        code: `
            const Component = () => (
                <div className="component" />
            );
        `,
    }, {
        filename: 'Component.jsx',
        code: `
            const SomeOtherThing = React.lazy();

            const Component = () => (
                <div className="component" />
            );
        `,
    }],
    invalid: [{
        filename: 'Component.jsx',
        code: `
            const SomeOtherName = () => (
                <div className="component" />
            );
        `,
        output: `
            const Component = () => (
                <div className="component" />
            );
        `,
        errors: [{
            messageId: 'componentName',
        }],
    }],
});
