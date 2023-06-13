const { RuleTester } = require('eslint');
const rule = require('../rules/jsx-multiline-prop-value-newline');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-multiline-prop-value-newline', rule, {
    valid: [{
        code: `
            <div
                key={(
                    value
                    || (
                        bla
                        && blub
                    )
                )}
            />
        `,
    }, {
        code: `
            <div
                key={value}
            />
        `,
    }, {
        code: `
            <div
                key={
                    some
                        .multiline
                        .value
                }
            />
        `,
    }, {
        code: `
            <div
                key={[
                    1,
                    2,
                ]}
            />
        `,
    }, {
        code: `
            <div
                key={{
                    key: value,
                }}
            />
        `,
    }, {
        code: `
            <div
                className={classnames(
                    'classA',
                    'classB'
                )}
            />
        `,
    }, {
        code: `
            <div
                className={
                    classnames(
                        'classA',
                        'classB'
                    )
                }
            />
        `,
    }, {
        code: `
            <div
                func={
                    (param) => (
                        someLogic()
                    )
                }
            />
        `,
    }, {
        code: `
            <div
                func={(param) => (
                    someLogic()
                )}
            />
        `,
    }, {
        code: `
            <div
                key={test && (
                    someLogic()
                )}
            />
        `,
    }, {
        code: `
            <div
                key={
                    test && (
                        someLogic()
                    )
                }
            />
        `,
    }, {
        code: `
            <div
                key={<div />}
            />
        `,
    }, {
        code: `
            <div
                key={
                    <div />
                }
            />
        `,
    }, {
        code: `
            <div
                key={test ? (
                    consequent()
                ) : (
                    alternate()
                )}
            />
        `,
    }, {
        code: `
            <div
                key={
                    test ? (
                        consequent()
                    ) : (
                        alternate()
                    )
                }
            />
        `,
    }],
    invalid: [{
        code: `
            <div
                key={
                    value
                }
            />
        `,
        output: `
            <div
                key={value}
            />
        `,
        errors: [{
            messageId: 'keyValueSeparateLines',
        }],
    }, {
        code: `
            <div
                key={some
                    .multiline
                    .value
                }
            />
        `,
        output: `
            <div
                key={
        some
                    .multiline
                    .value
    }
            />
        `,
        errors: [{
            messageId: 'keyValueSameLine',
        }],
    }, {
        code: `
            <div
                key={
                    [
                        1,
                        2,
                    ]
                }
            />
        `,
        output: `
            <div
                key={[
                        1,
                        2,
                    ]}
            />
        `,
        errors: [{
            messageId: 'keyValueSeparateLines',
        }],
    }, {
        code: `
            <div
                key={
                    {
                        key: value,
                    }
                }
            />
        `,
        output: `
            <div
                key={{
                        key: value,
                    }}
            />
        `,
        errors: [{
            messageId: 'keyValueSeparateLines',
        }],
    }],
});
