const nodeName = (node) => (
    node.name.name || `${node.name.object.name}.${node.name.property.name}`
);

const fixSingleMultilineProp = (context, node) => (fixer) => (
    fixer.replaceText(node, `<${nodeName(node)}
        ${context.sourceCode.getText(node.attributes[0])}
    ${node.selfClosing ? '/' : ''}>`)
);

const fixSinglePropMultiline = (context, node) => (fixer) => (
    fixer.replaceText(node, `<${nodeName(node)} ${context.sourceCode.getText(node.attributes[0])}${node.selfClosing ? ' /' : ''}>`)
);

module.exports = {
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        schema: [],
        docs: {
            description: 'Enforce multi-line jsx tags if there is only a single multi-line prop.',
        },
        messages: {
            singleMultilineProp: 'Have the prop on separate lines as the opening tag if the prop covers multiple lines.',
            singlePropMultiline: 'Have the opening tag on a single line if there is only one prop.',
        },
    },
    create: (context) => ({
        JSXOpeningElement: (node) => {
            if (node.attributes.length === 1) {
                const isMultilineProp = node.attributes[0].loc.start.line !== node.attributes[0].loc.end.line;

                if (isMultilineProp) {
                    if (
                        node.attributes[0].loc.start.line === node.loc.start.line
                        || node.attributes[0].loc.end.line === node.loc.end.line
                    ) {
                        context.report({
                            node,
                            messageId: 'singleMultilineProp',
                            fix: fixSingleMultilineProp(context, node),
                        });
                    }
                } else if (
                    node.attributes[0].loc.start.line !== node.loc.start.line
                    || node.attributes[0].loc.end.line !== node.loc.end.line
                ) {
                    context.report({
                        node,
                        messageId: 'singlePropMultiline',
                        fix: fixSinglePropMultiline(context, node),
                    });
                }
            }
        },
    }),
};
