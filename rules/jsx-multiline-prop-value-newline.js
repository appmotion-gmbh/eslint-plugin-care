const fixKeyValueSameLine = (context, node) => (fixer) => (
    fixer.replaceText(node, `${context.sourceCode.getText(node.name)}={
        ${context.sourceCode.getText(node.value.expression)}
    }`)
);

const fixKeyValueSeparateLines = (context, node) => (fixer) => (
    fixer.replaceText(node, `${context.sourceCode.getText(node.name)}={${context.sourceCode.getText(node.value.expression)}}`)
);

module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Enforce key and value of multi-line props to be on separate lines.',
        },
        messages: {
            keyValueSameLine: 'Place the value of the property on separate lines.',
            keyValueSeparateLines: 'Place the value of the property on the same line as the key.',
        },
    },
    create: (context) => ({
        JSXAttribute: (node) => {
            const isExpression = node.value?.type === 'JSXExpressionContainer';
            const isMultilineProp = node.loc.start.line !== node.loc.end.line;

            if (isExpression && isMultilineProp) {
                const isObject = node.value.expression.type === 'ObjectExpression';
                const isArray = node.value.expression.type === 'ArrayExpression';
                const isFunctionCall = node.value.expression.type === 'CallExpression';
                const isLogical = node.value.expression.type === 'LogicalExpression';
                const isConditional = node.value.expression.type === 'ConditionalExpression';
                const isArrowFunction = node.value.expression.type === 'ArrowFunctionExpression';
                const isJSXElement = node.value.expression.type === 'JSXElement';
                const isMultilineValue = node.value.expression.loc.start.line !== node.value.expression.loc.end.line;
                const isKeyOnSameLineAsValue = node.name.loc.start.line === node.value.expression.loc.start.line;

                if (isFunctionCall || isLogical || isConditional || isArrowFunction || isJSXElement) {
                    return;
                }

                if (isObject || isArray) {
                    if (isMultilineValue && !isKeyOnSameLineAsValue) {
                        context.report({
                            node,
                            messageId: 'keyValueSeparateLines',
                            fix: fixKeyValueSeparateLines(context, node),
                        });
                    }
                } else {
                    if (isMultilineValue && isKeyOnSameLineAsValue) {
                        context.report({
                            node,
                            messageId: 'keyValueSameLine',
                            fix: fixKeyValueSameLine(context, node),
                        });
                    }

                    if (!isMultilineValue && !isKeyOnSameLineAsValue) {
                        context.report({
                            node,
                            messageId: 'keyValueSeparateLines',
                            fix: fixKeyValueSeparateLines(context, node),
                        });
                    }
                }
            }
        },
    }),
};
