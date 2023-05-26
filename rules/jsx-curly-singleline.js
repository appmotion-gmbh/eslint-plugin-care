module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Prevent line breaks in JSX expressions.',
        },
        messages: {
            curlyMultiline: 'Place the JSX expression on the same line as the curly braces.',
        },
    },
    create: (context) => ({
        JSXExpressionContainer: (node) => {
            if (
                node.parent.type === 'JSXElement'
                    && (
                        node.loc.start.line !== node.expression.loc.start.line
                        || node.loc.end.line !== node.expression.loc.end.line
                    )
            ) {
                context.report({
                    node,
                    messageId: 'curlyMultiline',
                    fix: (fixer) => (
                        fixer.replaceText(node, `{${context.sourceCode.getText(node.expression)}}`)
                    ),
                });
            }
        },
    }),
};
