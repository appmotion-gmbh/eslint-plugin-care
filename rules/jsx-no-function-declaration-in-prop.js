module.exports = {
    meta: {
        type: 'layout',
        schema: [],
        docs: {
            description: 'Prevent function declarations within JSX props.',
        },
        messages: {
            functionDeclarationInProp: 'Define the function within the component root and reference it here.',
        },
    },
    create: (context) => ({
        JSXAttribute: (node) => {
            const isExpression = node.value?.type === 'JSXExpressionContainer';

            if (isExpression) {
                const isArrowFunction = node.value.expression.type === 'ArrowFunctionExpression';
                const isMultiline = node.value.expression.loc.start.line !== node.value.expression.loc.end.line;

                if (isArrowFunction && isMultiline) {
                    context.report({
                        node,
                        messageId: 'functionDeclarationInProp',
                    });
                }
            }
        },
    }),
};
