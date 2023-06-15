const fix = (context, node) => (fixer) => {
    if (node.type === 'BlockStatement') {
        return fixer.replaceText(node, `{
            ${node.body.map((inner) => context.sourceCode.getText(inner))}
        }`);
    }

    const hasParentheses = context.sourceCode.getTokenBefore(node).value === '(';

    return fixer.replaceText(node, `${hasParentheses ? '' : '('}
        ${context.sourceCode.getText(node)}
    ${hasParentheses ? '' : ')'}`);
};

const findArrowFunctionParent = (item) => {
    if (!item.parent) {
        return null;
    }

    if (item.parent.type === 'ArrowFunctionExpression') {
        return item.parent;
    }

    return findArrowFunctionParent(item.parent);
};

module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Prevent single-line function declarations.',
        },
        messages: {
            noHandlerSuffix: 'Place function body on a separate line from the head or use the "Handler" suffix in the function name.',
            singleLineFunctionDeclaration: 'Place function body on a separate line from the head.',
        },
    },
    create: (context) => ({
        ArrowFunctionExpression: (node) => {
            const arrowFunctionParent = findArrowFunctionParent(node);

            if (arrowFunctionParent) {
                if (node.loc.start.line === arrowFunctionParent.loc.start.line) {
                    if (node.parent === arrowFunctionParent) {
                        if (arrowFunctionParent.parent.type === 'VariableDeclarator' && !arrowFunctionParent.parent.id.name.endsWith('Handler')) {
                            context.report({
                                node,
                                messageId: 'noHandlerSuffix',
                                fix: fix(context, arrowFunctionParent.body),
                            });
                        }
                    } else {
                        context.report({
                            node,
                            messageId: 'singleLineFunctionDeclaration',
                            fix: fix(context, arrowFunctionParent.body),
                        });
                    }
                }
            } else {
                const parentTypes = ['VariableDeclarator', 'ExportDefaultDeclaration'];
                const bodyTypesToIgnore = ['ArrayExpression', 'ObjectExpression', 'ArrowFunctionExpression'];

                if (parentTypes.includes(node.parent.type)) {
                    if (node.body.type === 'BlockStatement') {
                        if (node.body.body[0].loc.start.line === node.parent.loc.start.line) {
                            context.report({
                                node,
                                messageId: 'singleLineFunctionDeclaration',
                                fix: fix(context, node.body),
                            });
                        }
                    } else if (!bodyTypesToIgnore.includes(node.body.type)) {
                        if (node.body.loc.start.line === node.parent.loc.start.line) {
                            context.report({
                                node,
                                messageId: 'singleLineFunctionDeclaration',
                                fix: fix(context, node.body),
                            });
                        }
                    }
                }
            }
        },
    }),
};
