module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Ensure that a JSX element\'s children are not positioned on the same line as the opening tag.',
        },
        messages: {
            newLine: 'Put a line break after the opening tag.',
        },
    },
    create: (context) => ({
        ':matches(JSXElement, JSXFragment)': (node) => {
            const openingElement = node.openingElement || node.openingFragment;
            const closingElement = node.closingElement || node.closingFragment;

            if (
                node.children.length > 0
                && !node.children[0].value?.startsWith('\n')
                && openingElement.loc.end.line !== closingElement.loc.start.line
            ) {
                context.report({
                    node: openingElement,
                    messageId: 'newLine',
                    fix: (fixer) => (
                        fixer.insertTextAfter(openingElement, '\n')
                    ),
                });
            }
        },
    }),
};
