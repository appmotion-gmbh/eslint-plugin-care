module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Enforce consistent line breaks for function arguments.',
        },
        messages: {
            shouldBeSingleLine: 'Place the argument in the same line as the function call.',
            shouldBeMultiLine: 'Place all arguments on separate lines.',
        },
    },
    create: (context) => ({
        CallExpression: (node) => {
            const exceptions = ['ArrowFunctionExpression', 'ObjectExpression', 'ArrayExpression', 'TemplateLiteral'];
            const singleArgumentExceptions = ['ArrowFunctionExpression', 'TemplateLiteral'];
            const multiLineArgumentCount = node.arguments.filter((argument) => (
                !exceptions.includes(argument.type) && argument.loc.start.line !== argument.loc.end.line
            )).length;
            const exceptionMultiLineArgumentCount = node.arguments.filter((argument) => (
                exceptions.includes(argument.type) && argument.loc.start.line !== argument.loc.end.line
            )).length;
            const singleArgumentExceptionMultiLineArgumentCount = node.arguments.filter((argument) => (
                singleArgumentExceptions.includes(argument.type) && argument.loc.start.line !== argument.loc.end.line
            )).length;
            const argumentsWithLineBreakCount = node.arguments.filter((argument, index) => (
                argument.loc.start.line > (node.arguments[index - 1] || node.callee).loc.end.line
            )).length;
            const argumentsWithoutLineBreakCount = node.arguments.filter((argument, index) => (
                argument.loc.start.line === (node.arguments[index - 1] || node.callee).loc.end.line
            )).length;
            const jsxArgumentCount = node.arguments.filter((argument) => (
                argument.type === 'JSXElement'
            )).length;
            const shouldBeMultiLine = (
                argumentsWithoutLineBreakCount > 0
                && (
                    argumentsWithLineBreakCount > 0
                    || multiLineArgumentCount > 0
                    || jsxArgumentCount > 0
                    || singleArgumentExceptionMultiLineArgumentCount > 1
                    || (
                        exceptionMultiLineArgumentCount > 0
                        && argumentsWithoutLineBreakCount > 2
                    )
                )
            );
            const callee = node.callee.property || node.callee;
            const shouldBeSingleLine = (
                (
                    node.arguments.length === 1
                    && argumentsWithLineBreakCount === 1
                    && multiLineArgumentCount === 0
                    && jsxArgumentCount === 0
                )
                || (
                    argumentsWithLineBreakCount === 0
                    && multiLineArgumentCount === 0
                    && exceptionMultiLineArgumentCount === 0
                    && callee.loc.start.line < node.loc.end.line
                )
            );

            if (shouldBeMultiLine) {
                context.report({
                    node,
                    messageId: 'shouldBeMultiLine',
                    fix: (fixer) => (
                        fixer.replaceText(node, `${context.sourceCode.getText(node.callee)}(
                            ${node.arguments.map((argument) => context.sourceCode.getText(argument)).join(',\n')}
                        )`)
                    ),
                });
            } else if (shouldBeSingleLine) {
                context.report({
                    node,
                    messageId: 'shouldBeSingleLine',
                    fix: (fixer) => (
                        fixer.replaceText(node, `${context.sourceCode.getText(node.callee)}(${node.arguments.map((argument) => context.sourceCode.getText(argument)).join(', ')})`)
                    ),
                });
            }
        },
    }),
};
