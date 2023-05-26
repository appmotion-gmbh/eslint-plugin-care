module.exports = {
    meta: {
        name: 'eslint-plugin-care',
        version: '1.0.0',
    },
    rules: {
        'jsx-curly-singleline': require('./rules/jsx-curly-singleline'),
        'jsx-multiline-element-newline': require('./rules/jsx-multiline-element-newline'),
        'jsx-multiline-prop-value-newline': require('./rules/jsx-multiline-prop-value-newline'),
        'jsx-multiline-props': require('./rules/jsx-multiline-props'),
        'jsx-no-function-declaration-in-prop': require('./rules/jsx-no-function-declaration-in-prop'),
        'jsx-no-padded-elements': require('./rules/jsx-no-padded-elements'),
        'jsx-one-element-per-line': require('./rules/jsx-one-element-per-line'),
        'jsx-root-newline': require('./rules/jsx-root-newline'),
        'multiline-ternary-parens': require('./rules/multiline-ternary-parens'),
    }
};
