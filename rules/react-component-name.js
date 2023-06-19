const path = require('path');

module.exports = {
    meta: {
        type: 'suggestion',
        fixable: 'code',
        schema: [],
        docs: {
            description: 'Enforce matching React component names and filenames.',
        },
        messages: {
            componentName: 'The component name must match the filename.',
        },
    },
    create: (context) => {
        if (!context.filename) {
            return {};
        }

        const filename = path.basename(context.filename, path.extname(context.filename));

        return {
            ':matches(Program > VariableDeclaration > VariableDeclarator > Identifier)': (node) => {
                if (
                    node.name[0] !== node.name[0].toUpperCase()
                    || node.name[1] !== node.name[1].toLowerCase()
                    || node.parent.init.type !== 'ArrowFunctionExpression'
                ) {
                    return;
                }

                if (node.name !== filename) {
                    context.report({
                        node,
                        messageId: 'componentName',
                        fix: (fixer) => (
                            fixer.replaceText(node, filename)
                        ),
                    });
                }
            },
        };
    },
};
