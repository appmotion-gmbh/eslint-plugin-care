module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Enforce consistent call expression line breaks.',
        },
        messages: {
            separate: 'Place each chained call on a separate line.',
            together: 'Place the chained call on the same line as the member object.',
        },
    },
    create: (context) => ({
        CallExpression: (node) => {
            if (node.parent.type === 'MemberExpression') {
                return;
            }

            const isMultilineCallChain = node.loc.start.line !== node.loc.end.line;
            let parent = node;
            let hasMultilineCallToFix = false;
            const path = [];
            let expressionsToFix = [];
            let callExpressionCount = 0;

            while (parent && ['CallExpression', 'MemberExpression'].includes(parent.type)) {
                if (parent.type === 'CallExpression') {
                    callExpressionCount += 1;

                    const isFirstLine = parent.callee.loc.end.line === node.loc.start.line;
                    const isMultilineCall = parent.callee.loc.end.line !== parent.loc.end.line;
                    const hasNextInChainOnSameLineOrIsLastInChain = (
                        !parent.parent.property
                        || parent.loc.end.line === parent.parent.property?.loc.start.line
                    );
                    const hasPreviousInChainOnSameLine = parent.callee.loc.end.line === parent.callee.object?.loc.end.line;

                    if (isMultilineCall && hasNextInChainOnSameLineOrIsLastInChain) {
                        hasMultilineCallToFix = true;
                        expressionsToFix = path;
                    }

                    if (
                        (isMultilineCall && hasPreviousInChainOnSameLine && (!isFirstLine || path.length > 0))
                        || (isMultilineCallChain && parent.loc.end.line === parent.callee.object?.loc.end.line)
                    ) {
                        const allowedSingleLineChains = ['Object', 'Array'];
                        const allowedMultiLineParents = ['ObjectExpression', 'ArrayExpression'];

                        if (
                            !allowedSingleLineChains.includes(parent.callee.object.name)
                            && !allowedMultiLineParents.includes(parent.callee.object.type)
                        ) {
                            path.push(parent.callee.object);
                        }
                    }

                    parent = parent.callee.object;
                } else {
                    const isFirstLine = parent.loc.end.line === node.loc.start.line;

                    if (
                        isMultilineCallChain
                        && (!isFirstLine || parent.object.type === 'CallExpression')
                        && parent.loc.end.line === parent.object?.loc.end.line
                    ) {
                        path.push(parent.object);
                    }

                    parent = parent.object;
                }
            }

            if (!hasMultilineCallToFix) {
                expressionsToFix = path;
            }

            if (expressionsToFix.length > 0) {
                context.report({
                    node,
                    messageId: 'separate',
                    fix: (fixer) => (
                        expressionsToFix.map((item) => (
                            fixer.insertTextBefore(context.sourceCode.getTokenAfter(item), '\n')
                        ))
                    ),
                });
            } else if (callExpressionCount === 1) {
                if (
                    node.callee.type === 'MemberExpression'
                    && node.callee.property.loc.start.line - node.loc.start.line === 1
                ) {
                    context.report({
                        node,
                        messageId: 'together',
                        fix: (fixer) => (
                            fixer.replaceText(node.callee, `${context.sourceCode.getText(node.callee.object)}.${context.sourceCode.getText(node.callee.property)}`)
                        ),
                    });
                }
            }
        },
    }),
};
