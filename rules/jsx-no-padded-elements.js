module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Prevent padding of JSX elements with blank lines.',
        },
        messages: {
            paddedElement: 'JSX element must not be padded by blank lines.',
        },
    },
    create: (context) => ({
        ':matches(JSXElement, JSXFragment)': (node) => {
            if (node.children.length === 0) {
                return;
            }

            const firstChild = node.children[0];
            const lastChild = node.children[node.children.length - 1];

            if (firstChild.type === 'JSXText') {
                const paddingMatch = firstChild.value?.match(/^\s*\n\s*\n\s*(.*)/s);

                if (paddingMatch) {
                    context.report({
                        node: firstChild,
                        messageId: 'paddedElement',
                        fix: (fixer) => (
                            fixer.replaceText(firstChild, `\n${paddingMatch[1] || ''}`)
                        ),
                    });
                }
            }

            if (lastChild.type === 'JSXText') {
                const paddingMatch = lastChild.value?.match(/(.*)\s*\n\s*\n\s*$/s);

                if (paddingMatch) {
                    context.report({
                        node: lastChild,
                        messageId: 'paddedElement',
                        fix: (fixer) => (
                            fixer.replaceText(lastChild, `${paddingMatch[1] || ''}\n`)
                        ),
                    });
                }
            }
        },
    }),
};
