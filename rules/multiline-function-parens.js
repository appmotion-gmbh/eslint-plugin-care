module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Enforce consistent line breaks for function arguments.',
        },
        messages: {
            invalidLineBreaks: 'Place all arguments either in the same line or on separate lines if they are all single-line; place them on separate lines if at least one argument is multi-line.',
        },
    },
    create: (context) => ({
        CallExpression: (node) => {
            const exceptions = ['ArrowFunctionExpression', 'ObjectExpression', 'ArrayExpression'];
            const multiLineArgumentCount = node.arguments.some((argument) => (
                !exceptions.includes(argument.type) && argument.loc.start.line !== argument.loc.end.line
            ));
            const exceptionMultiLineArgumentCount = node.arguments.filter((argument) => (
                exceptions.includes(argument.type) && argument.loc.start.line !== argument.loc.end.line
            )).length;
            const argumentsWithLineBreakCount = node.arguments.filter((argument, index) => (
                argument.loc.start.line > (node.arguments[index - 1] || node.callee).loc.end.line
            )).length;
            const argumentsWithoutLineBreakCount = node.arguments.filter((argument, index) => (
                argument.loc.start.line === (node.arguments[index - 1] || node.callee).loc.end.line
            )).length;
            const hasError = (
                argumentsWithoutLineBreakCount > 0
                && (
                    argumentsWithLineBreakCount > 0
                    || multiLineArgumentCount > 0
                    || exceptionMultiLineArgumentCount > 1
                    || (
                        exceptionMultiLineArgumentCount > 0
                        && argumentsWithoutLineBreakCount > 2
                    )
                )
            );

            if (hasError) {
                context.report({
                    node,
                    messageId: 'invalidLineBreaks',
                    fix: (fixer) => (
                        fixer.replaceText(node, `${context.sourceCode.getText(node.callee)}(
                            ${node.arguments.map((argument, index) => `${context.sourceCode.getText(argument)}${index === node.arguments.length - 1 ? '' : ','}`).join('\n')}
                        )`)
                    ),
                });
            }
        },
    }),
};
