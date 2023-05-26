const fix = (node) => (fixer) => (
    [
        fixer.insertTextBefore(node, '\n'),
        fixer.insertTextAfter(node, '\n'),
    ]
);

module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Prevent single-line nesting of JSX elements.',
        },
        messages: {
            oneElementPerLine: 'Place the inner JSX element on its own line.',
        },
    },
    create: (context) => ({
        ':matches(JSXElement, JSXFragment)': (node) => {
            if (
                ['JSXElement', 'JSXFragment'].includes(node.parent.type)
                    && node.loc.start.line === node.parent.loc.start.line
                    && node.loc.end.line === node.parent.loc.end.line
            ) {
                context.report({
                    node,
                    messageId: 'oneElementPerLine',
                    fix: fix(node),
                });
            }
        },
    }),
};
