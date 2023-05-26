const addParentheses = (context, node) => (fixer) => (
    fixer.replaceText(node, `${context.sourceCode.getText(node.test)} ? (
        ${context.sourceCode.getText(node.consequent)}
    ) : (
        ${context.sourceCode.getText(node.alternate)}
    )`)
);

const removeParentheses = (context, node) => (fixer) => (
    fixer.replaceText(node, `${context.sourceCode.getText(node.test)}
        ? ${context.sourceCode.getText(node.consequent)}
        : ${context.sourceCode.getText(node.alternate)}`)
);

const containsJsx = (node) => {
    const jsxTypes = ['JSXElement', 'JSXFragment'];

    return jsxTypes.includes(node.consequent.type) || jsxTypes.includes(node.alternate.type);
};

module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Enforce consistent layout for multiline ternary expressions.',
        },
        messages: {
            invalidParentheses: 'Place parentheses on the same lines as the question mark and colon and the consequent and alternate on their own lines.',
            missingParentheses: 'Use parentheses around consequent and alternate in multi-line ternary expressions or those containing JSX.',
            superfluousParentheses: 'Don\'t use parentheses in single-line ternary expressions.',
        },
    },
    create: (context) => ({
        ConditionalExpression: (node) => {
            const tokenBeforeConsequent = context.sourceCode.getTokenBefore(node.consequent);
            const tokenAfterConsequent = context.sourceCode.getTokenAfter(node.consequent);
            const tokenBeforeAlternate = context.sourceCode.getTokenBefore(node.alternate);
            const tokenAfterAlternate = context.sourceCode.getTokenAfter(node.alternate);
            const isMultilineConditional = (
                node.consequent.loc.start.line !== node.test.loc.start.line
                    || node.alternate.loc.start.line !== node.test.loc.start.line
            );
            const isMultilineConsequent = node.consequent.loc.start.line !== node.consequent.loc.end.line;
            const isMultilineAlternate = node.alternate.loc.start.line !== node.alternate.loc.end.line;
            const isConsequentWrappedInParentheses = tokenBeforeConsequent.value === '(' && tokenAfterConsequent.value === ')';
            const isAlternateWrappedInParentheses = tokenBeforeAlternate.value === '(' && tokenAfterAlternate.value === ')';
            const isMultilineConsequentWithParentheses = (
                isConsequentWrappedInParentheses
                    && (
                        isMultilineConsequent
                        || node.consequent.loc.start.line !== tokenBeforeConsequent.loc.end.line
                        || node.consequent.loc.end.line !== tokenAfterConsequent.loc.end.line
                    )
            );
            const isMultilineAlternateWithParentheses = (
                isAlternateWrappedInParentheses
                    && (
                        isMultilineAlternate
                        || node.alternate.loc.start.line !== tokenBeforeAlternate.loc.end.line
                        || node.alternate.loc.end.line !== tokenAfterAlternate.loc.end.line
                    )
            );

            if (isMultilineConditional) {
                if (isMultilineConsequent || isMultilineAlternate) {
                    if (!isConsequentWrappedInParentheses || !isAlternateWrappedInParentheses) {
                        context.report({
                            node,
                            messageId: 'missingParentheses',
                            fix: addParentheses(context, node),
                        });
                    } else {
                        const colon = context.sourceCode.getTokenAfter(tokenAfterConsequent);

                        if (
                            tokenBeforeConsequent.loc.start.line !== node.consequent.loc.start.line - 1
                                || tokenBeforeConsequent.loc.start.line !== node.test.loc.start.line
                                || tokenAfterConsequent.loc.end.line !== node.consequent.loc.end.line + 1
                                || tokenAfterConsequent.loc.start.line !== colon.loc.start.line
                                || tokenBeforeAlternate.loc.start.line !== node.alternate.loc.start.line - 1
                                || tokenBeforeAlternate.loc.start.line !== colon.loc.start.line
                                || tokenAfterAlternate.loc.end.line !== node.alternate.loc.end.line + 1
                        ) {
                            context.report({
                                node,
                                messageId: 'invalidParentheses',
                                fix: addParentheses(context, node),
                            });
                        }
                    }
                } else if (isMultilineConsequentWithParentheses || isMultilineAlternateWithParentheses) {
                    if (containsJsx(node)) {
                        if (!isConsequentWrappedInParentheses || !isAlternateWrappedInParentheses) {
                            context.report({
                                node,
                                messageId: 'missingParentheses',
                                fix: addParentheses(context, node),
                            });
                        }
                    } else {
                        context.report({
                            node,
                            messageId: 'superfluousParentheses',
                            fix: removeParentheses(context, node),
                        });
                    }
                }
            } else if (isConsequentWrappedInParentheses || isAlternateWrappedInParentheses) {
                if (!containsJsx(node)) {
                    context.report({
                        node,
                        messageId: 'superfluousParentheses',
                        fix: removeParentheses(context, node),
                    });
                }
            }
        },
    }),
};
