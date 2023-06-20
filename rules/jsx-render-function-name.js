module.exports = {
    meta: {
        type: 'layout',
        schema: [],
        docs: {
            description: 'Ensure that functions returning JSX are prefixed with "render".',
        },
        messages: {
            wrongName: 'A function that returns JSX should be prefixed with "render".',
        },
    },
    create: (context) => ({
        'Program > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression > BlockStatement > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression JSXElement': (node) => {
            const findParent = (item) => (
                item.parent?.type === 'ArrowFunctionExpression'
                    ? item.parent
                    : findParent(item.parent)
            );

            const parentArrowFunction = findParent(node);

            if (parentArrowFunction.parent.id && !parentArrowFunction.parent.id.name.startsWith('render')) {
                context.report({
                    node: parentArrowFunction.parent.id,
                    messageId: 'wrongName',
                });
            }
        },
    }),
};
