module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Enforce consistent indentation of multi-line logical expressions.',
        },
        messages: {
            invalidIndent: 'Expected indentation of {{ expected }} spaces but found {{ found }}.',
        },
    },
    create: (context) => ({
        LogicalExpression: (node) => {
            if (node.left.loc.start.line < node.right.loc.start.line) {
                const { lines } = context.sourceCode;
                const operatorToken = context
                    .getSourceCode()
                    .getTokensBetween(node.left, node.right)
                    .find(({ value }) => value === node.operator);
                const tokenBeforeOperator = context.getSourceCode().getTokenBefore(operatorToken);
                const left = tokenBeforeOperator.value === ')' ? tokenBeforeOperator : node.left;

                if (operatorToken.loc.start.line === left.loc.start.line) {
                    return;
                }

                const right = operatorToken;
                const spacesRight = lines[right.loc.start.line - 1].search(/\S/);
                const spacesLeft = lines[left.loc.start.line - 1].search(/\S/);
                const columnDifference = spacesRight - spacesLeft;

                if (columnDifference !== 0) {
                    context.report({
                        loc: {
                            start: { line: right.loc.start.line, column: 0 },
                            end: { line: right.loc.start.line, column: right.loc.start.column },
                        },
                        messageId: 'invalidIndent',
                        data: {
                            expected: right.loc.start.column - columnDifference,
                            found: right.loc.start.column,
                        },
                        fix: (fixer) => {
                            const range = [right.range[0] - right.loc.start.column, right.range[0]];

                            return fixer.replaceTextRange(range, ' '.repeat((range[1] - range[0]) - columnDifference));
                        },
                    });
                }
            }
        },
    }),
};
