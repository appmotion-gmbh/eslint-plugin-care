const findClassNames = require('./utils/findClassNames');
const extractBemBlock = require('./utils/extractBemBlock');

const hasParentWithClassName = (identifiers, node) => {
    if (!node.parent) {
        return false;
    }

    if (node.parent.type === 'JSXElement') {
        const classNameAttribute = node.parent.openingElement.attributes.find(({ name }) => name?.name === 'className');

        if (classNameAttribute) {
            return true;
        }
    }

    if (node.parent.type === 'VariableDeclarator') {
        const identifierNode = identifiers[node.parent.id.name];

        if (identifierNode) {
            return hasParentWithClassName(identifiers, identifierNode.parent);
        }

        return false;
    }

    return hasParentWithClassName(identifiers, node.parent);
};

const checkClassNameFormat = (context, { node, classNames }, expectedBemBlockSuffix) => {
    const classNamesWithoutModifiers = classNames
        .filter(({ className }) => !className.split('--')[1])
        .map(({ className }) => className.split('--')[0]);
    const classNamesWithModifiers = classNames
        .filter(({ className }) => className.split('--')[1])
        .map(({ className }) => className.split('--')[0]);

    if (!classNamesWithModifiers.every((className) => classNamesWithoutModifiers.includes(className))) {
        context.report({
            node,
            messageId: 'invalidModifier',
        });
    } else if (classNames[0].className.split('--')[1]) {
        context.report({
            node,
            messageId: 'invalidModifierPosition',
        });
    } else {
        const hasBemBlockSuffix = (className) => {
            const bemBlock = extractBemBlock(className);

            return bemBlock === expectedBemBlockSuffix || bemBlock.endsWith(`-${expectedBemBlockSuffix}`);
        };

        if (classNames.some(({ className }) => !hasBemBlockSuffix(className))) {
            context.report({
                node,
                messageId: 'componentMismatch',
            });
        } else {
            const bemRegex = /^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+)?$/;

            if (classNames.some(({ className }) => !className.match(bemRegex))) {
                context.report({
                    node,
                    messageId: 'invalidClassName',
                });
            }
        }
    }
};

module.exports = {
    meta: {
        type: 'suggestion',
        schema: [],
        docs: {
            description: 'Enforce correct BEM usage in React components.',
        },
        messages: {
            child: 'Add a BEM element to the class names of non-root JSX elements.',
            multipleRootElements: 'Do not have more than one JSX element with a class name consisting of only a BEM block.',
            componentMismatch: 'The BEM block must equal or end with a kebab-case version of the component name (e.g. SomeComponent -> "some-component" or "some-prefix-some-component").',
            blockMismatch: 'Use the same BEM block as in the root JSX element.',
            invalidClassName: 'Class names must be in BEM format: "block" or "block__element" or "block--modifier" or "block__element--modifier".',
            invalidModifier: 'Class names with a BEM modifier must have the same BEM block and BEM element as another class name in this JSX element.',
            invalidModifierPosition: 'The first class name in an element should not have a BEM modifier.',
        },
    },
    create: (context) => {
        const identifiers = {};
        const jsxAttributes = [];
        let expectedBemBlockSuffix;

        return {
            ':matches(Program > VariableDeclaration > VariableDeclarator > Identifier)': (node) => {
                if (expectedBemBlockSuffix || node.name[0] !== node.name[0].toUpperCase() || node.name[1] !== node.name[1].toLowerCase()) {
                    return;
                }

                expectedBemBlockSuffix = `${node.name[0].toLowerCase()}${node.name.slice(1).replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            },
            ':matches(JSXExpressionContainer Identifier, .init Identifier)': (node) => {
                identifiers[node.name] = node;
            },
            JSXAttribute: (node) => {
                if (node.name.name !== 'className') {
                    return;
                }

                const classNames = findClassNames(node.value);

                if (classNames.length === 0) {
                    return;
                }

                jsxAttributes.push({ node, classNames });
            },
            'Program:exit': () => {
                const { rootElements, childElements } = jsxAttributes.reduce((result, element) => (
                    hasParentWithClassName(identifiers, element.node.parent.parent)
                        ? { ...result, childElements: [...result.childElements, element] }
                        : { ...result, rootElements: [...result.rootElements, element] }
                ), { rootElements: [], childElements: [] });

                if (rootElements.length === 0) {
                    return;
                }

                const bemBlock = extractBemBlock(rootElements[0].classNames[0].className);

                rootElements.forEach((element, index) => {
                    const hasBemElement = element.classNames.some(({ className }) => className.includes('__'));

                    checkClassNameFormat(context, element, expectedBemBlockSuffix);

                    const hasMultipleBemBlocks = element.classNames.some(({ className }) => extractBemBlock(className) !== bemBlock);

                    if (index > 0 && !hasBemElement && hasMultipleBemBlocks) {
                        element.classNames.forEach(({ className, node }) => {
                            if (extractBemBlock(className) !== bemBlock) {
                                context.report({
                                    node,
                                    messageId: 'multipleRootElements',
                                });
                            }
                        });
                    }
                });

                childElements.forEach((element) => {
                    checkClassNameFormat(context, element, expectedBemBlockSuffix);

                    element.classNames.forEach(({ className, node }) => {
                        if (extractBemBlock(className) !== bemBlock) {
                            context.report({
                                node,
                                messageId: 'blockMismatch',
                            });
                        } else if (!className.includes('__')) {
                            context.report({
                                node: element.node,
                                messageId: 'child',
                            });
                        }
                    });
                });
            },
        };
    },
};
