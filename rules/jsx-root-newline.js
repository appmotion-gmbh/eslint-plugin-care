const fix = (node) => (fixer) => (
    [
        fixer.insertTextBefore(node, '(\n'),
        fixer.insertTextAfter(node, '\n)'),
    ]
);

module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Enforce JSX root elements to be on their own line.',
        },
        messages: {
            rootNewline: 'Place the JSX element on its own line and wrap it in parentheses.',
        },
    },
    create: (context) => ({
        ':matches(JSXElement, JSXFragment)': (node) => {
            if (
                !['JSXElement', 'JSXFragment'].includes(node.parent.type)
                    && node.loc.start.line === node.parent.loc.start.line
                    && node.loc.end.line === node.parent.loc.end.line
            ) {
                context.report({
                    node,
                    messageId: 'rootNewline',
                    fix: fix(node),
                });
            }
        },
    }),
};
