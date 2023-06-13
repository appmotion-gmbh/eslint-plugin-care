const fixBlock = (context, node) => (fixer) => (
    fixer.replaceText(node, `{
        ${node.body.map((inner) => context.sourceCode.getText(inner))}
    }`)
);

const fixCall = (context, node) => (fixer) => {
    const hasParentheses = context.sourceCode.getTokenBefore(node).value === '(';

    return fixer.replaceText(node, `${hasParentheses ? '' : '('}
        ${context.sourceCode.getText(node)}
    ${hasParentheses ? '' : ')'}`);
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
            const parentTypes = ['VariableDeclarator', 'ExportDefaultDeclaration'];
            const bodyTypesToIgnore = ['ArrayExpression', 'ObjectExpression'];

            if (parentTypes.includes(node.parent.type)) {
                if (node.body.type === 'BlockStatement') {
                    if (node.body.body[0].loc.start.line === node.parent.loc.start.line) {
                        context.report({
                            node,
                            messageId: 'singleLineFunctionDeclaration',
                            fix: fixBlock(context, node.body),
                        });
                    }
                } else if (node.body.type === 'ArrowFunctionExpression') {
                    if (node.parent.type === 'VariableDeclarator' && !node.parent.id.name.endsWith('Handler')) {
                        if (node.body.loc.start.line === node.parent.loc.start.line) {
                            context.report({
                                node,
                                messageId: 'noHandlerSuffix',
                                fix: fixCall(context, node.body),
                            });
                        }
                    }
                } else if (!bodyTypesToIgnore.includes(node.body.type)) {
                    if (node.body.loc.start.line === node.parent.loc.start.line) {
                        context.report({
                            node,
                            messageId: 'singleLineFunctionDeclaration',
                            fix: fixCall(context, node.body),
                        });
                    }
                }
            }
        },
    }),
};
