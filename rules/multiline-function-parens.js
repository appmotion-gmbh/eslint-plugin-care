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
            const hasMultiLineArguments = node.arguments.some((argument) => (
                argument.loc.start.line !== argument.loc.end.line
            ));
            const hasArgumentsWithLineBreak = node.arguments.some((argument, index) => (
                argument.loc.start.line > (node.arguments[index - 1] || node.callee).loc.end.line
            ));
            const hasArgumentsWithoutLineBreak = node.arguments.some((argument, index) => (
                argument.loc.start.line === (node.arguments[index - 1] || node.callee).loc.end.line
            ));

            if (hasArgumentsWithoutLineBreak && (hasArgumentsWithLineBreak || hasMultiLineArguments)) {
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
