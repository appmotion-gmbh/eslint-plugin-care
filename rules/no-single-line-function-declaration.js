const fix = (context, node, singleLine = false) => (fixer) => {
    if (node.type === 'BlockStatement') {
        return fixer.replaceText(node, `{
            ${node.body.map((inner) => context.sourceCode.getText(inner))}
        }`);
    }

    if (singleLine) {
        const body = node.body.type === 'ObjectExpression'
            ? `(${context.sourceCode.getText(node.body)})`
            : context.sourceCode.getText(node.body);

        return fixer.replaceText(node, `(${node.params.map((param) => context.sourceCode.getText(param)).join(', ')}) => ${body}`);
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
            shouldBeMultiLine: 'Place function body on a separate line from the head.',
            shouldBeSingleLine: 'Place function body on the same line as the head.',
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
                            messageId: 'shouldBeMultiLine',
                            fix: fix(context, arrowFunctionParent.body),
                        });
                    }
                }
            } else {
                const parentTypes = ['VariableDeclarator', 'ExportDefaultDeclaration'];
                const singleLineBodyTypes = ['ArrayExpression', 'ObjectExpression', 'TemplateLiteral'];

                if (parentTypes.includes(node.parent.type)) {
                    if (node.body.type === 'BlockStatement' && node.body.body.length > 0) {
                        if (node.body.body[0].loc.start.line === node.parent.loc.start.line) {
                            context.report({
                                node,
                                messageId: 'shouldBeMultiLine',
                                fix: fix(context, node.body),
                            });
                        }
                    } else if (node.body.type === 'ArrowFunctionExpression') {
                        // Do nothing
                    } else if (singleLineBodyTypes.includes(node.body.type)) {
                        if (
                            node.body.loc.start.line > node.parent.loc.start.line
                            && node.body.loc.start.line < node.body.loc.end.line
                        ) {
                            context.report({
                                node,
                                messageId: 'shouldBeSingleLine',
                                fix: fix(context, node, true),
                            });
                        }
                    } else if (node.body.loc.start.line === node.parent.loc.start.line) {
                        context.report({
                            node,
                            messageId: 'shouldBeMultiLine',
                            fix: fix(context, node.body),
                        });
                    }
                }
            }
        },
    }),
};
