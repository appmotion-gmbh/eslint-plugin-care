const { RuleTester } = require('eslint');
const rule = require('../rules/jsx-dir-matches-sass-dir');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-dir-matches-sass-dir', rule, {
    valid: [{
        code: `
            <div className="test">
                <div className="a" />
                <div className="b" />
                <div className="test__foo" />
                <div className="test__bar" />
                <div className="test__something" />
                <div className="test__something-else" />
                <div className="test__something-more" />
                <div className={classNames('test__element', \`test__element--\${modifier}\`, { 'test__element--mod': true })} />
                <div className="test__element-two" />
                <div className="test__element-three" />
                <div className="test__element-four" />
                <div className="test__element-five" />
                <div className="test__element-six" />
            </div>
        `,
        filename: 'components/Test.jsx',
        options: [{ sassRoot: 'test/sass' }],
    }, {
        code: `
            <div className="rule-without-declarations" />
        `,
        filename: 'components/Test.jsx',
        options: [{ sassRoot: 'test/sass' }],
    }],
    invalid: [{
        code: `
            <div className="test__nope" />
        `,
        filename: 'components/Test.jsx',
        options: [{ sassRoot: 'test/sass' }],
        errors: [{
            messageId: 'missingClassName',
        }],
    }, {
        code: `
            <div className="invalid" />
        `,
        filename: 'components/Invalid.jsx',
        options: [{ sassRoot: 'test/sass' }],
        errors: [{
            messageId: 'mismatch',
        }],
    }],
});
