const fixSingleMultilineProp = (context, node) => (fixer) => (
    fixer.replaceText(
        node,
        context.sourceCode.getText(node).replace(/(\n)(?!.*\1)/g, '\n\n'),
    )
);

module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Enforce line breaks before and after multi-line jsx tags.',
        },
        messages: {
            missingLineBreakBefore: 'Add a line break before the opening tag.',
            missingLineBreakAfter: 'Add a line break after the closing tag.',
        },
    },
    create: (context) => {
        const jsxElementParents = new Set();

        return {
            'Program:exit': () => {
                jsxElementParents.forEach((parent) => {
                    parent.children.forEach((element, index, elements) => {
                        if (element.type === 'JSXElement' || element.type === 'JSXExpressionContainer') {
                            const firstAdjacentSibling = elements[index + 1];
                            const secondAdjacentSibling = elements[index + 2];
                            const hasSibling = (
                                firstAdjacentSibling
                                && secondAdjacentSibling
                                && (firstAdjacentSibling.type === 'Literal' || firstAdjacentSibling.type === 'JSXText')
                            );

                            if (!hasSibling) {
                                return;
                            }

                            const isMultiline = element.loc.start.line !== element.loc.end.line;
                            const isWithoutNewLine = !/\n\s*\n/.test(firstAdjacentSibling.value);

                            if (isMultiline) {
                                if (isWithoutNewLine) {
                                    context.report({
                                        node: firstAdjacentSibling,
                                        messageId: 'missingLineBreakAfter',
                                        fix: fixSingleMultilineProp(context, firstAdjacentSibling),
                                    });
                                }
                            } else {
                                const isSiblingMultiline = secondAdjacentSibling.loc.start.line !== secondAdjacentSibling.loc.end.line;
                                const hasComments = context.sourceCode.getCommentsInside(element).length > 0;

                                if (isWithoutNewLine && isSiblingMultiline && !hasComments) {
                                    context.report({
                                        node: firstAdjacentSibling,
                                        messageId: 'missingLineBreakBefore',
                                        fix: fixSingleMultilineProp(context, firstAdjacentSibling),
                                    });
                                }
                            }
                        }
                    });
                });
            },
            ':matches(JSXElement, JSXFragment) > :matches(JSXElement, JSXExpressionContainer)': (node) => {
                jsxElementParents.add(node.parent);
            },
        };
    },
};
