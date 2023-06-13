module.exports = {
    meta: {
        type: 'suggestion',
        schema: [],
        docs: {
            description: 'Enforce usage of async/await instead of Promise.then.',
        },
        messages: {
            promise: 'Use async/await instead of Promise.then.',
        },
    },
    create: (context) => ({
        CallExpression: (node) => {
            if (
                node.callee.type === 'MemberExpression'
                && node.callee.property.type === 'Identifier'
                && node.callee.property.name === 'then'
            ) {
                context.report({
                    node,
                    messageId: 'promise',
                });
            }
        },
    }),
};
