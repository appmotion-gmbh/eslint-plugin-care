module.exports = {
    meta: {
        name: 'eslint-plugin-care',
    },
    rules: {
        'chained-call-newline': require('./rules/chained-call-newline'),
        'jsx-bem': require('./rules/jsx-bem'),
        'jsx-curly-singleline': require('./rules/jsx-curly-singleline'),
        'jsx-dir-matches-sass-dir': require('./rules/jsx-dir-matches-sass-dir'),
        'jsx-multiline-element-newline': require('./rules/jsx-multiline-element-newline'),
        'jsx-multiline-prop-value-newline': require('./rules/jsx-multiline-prop-value-newline'),
        'jsx-multiline-props': require('./rules/jsx-multiline-props'),
        'jsx-no-function-declaration-in-prop': require('./rules/jsx-no-function-declaration-in-prop'),
        'jsx-no-padded-elements': require('./rules/jsx-no-padded-elements'),
        'jsx-one-element-per-line': require('./rules/jsx-one-element-per-line'),
        'jsx-root-newline': require('./rules/jsx-root-newline'),
        'logical-indent': require('./rules/logical-indent'),
        'multiline-function-parens': require('./rules/multiline-function-parens'),
        'multiline-ternary-parens': require('./rules/multiline-ternary-parens'),
        'no-single-line-function-declaration': require('./rules/no-single-line-function-declaration'),
        'prefer-async-await': require('./rules/prefer-async-await'),
        'react-component-name': require('./rules/react-component-name'),
    },
};
