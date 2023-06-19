const fs = require('fs');
const postcss = require('postcss');
const postcssSass = require('postcss-sass-2');
const findClassNames = require('./utils/findClassNames');
const extractBemBlock = require('./utils/extractBemBlock');

const buildClassNames = (sassNode, suffix = '', skipDeclarationCheck = false) => {
    if (!suffix && !skipDeclarationCheck) {
        const hasDeclarations = sassNode.nodes.some((childNode) => (
            childNode.type === 'decl'
            || childNode.type === 'atrule'
            || (childNode.type === 'rule' && !childNode.selector.startsWith('&'))
        ));

        if (!hasDeclarations) {
            return [];
        }
    }

    return sassNode.selector.replace(/\s/g, '').split(',').flatMap((selector) => {
        if (selector[0] === '@') {
            return [];
        }

        if (sassNode.parent?.type !== 'rule') {
            return `${selector.slice(1)}${suffix}`;
        }

        if (selector[0] === '&') {
            if (selector[1] === '.') {
                return [
                    `${selector.slice(2)}${suffix}`,
                    ...buildClassNames(sassNode.parent),
                ];
            }

            if (selector[1] === ':') {
                return buildClassNames(sassNode.parent, '', true);
            }

            return [
                ...buildClassNames(sassNode.parent, `${selector.slice(1)}${suffix}`),
                ...buildClassNames(sassNode.parent),
            ];
        }

        return [
            ...selector.replace(/&/g, '').split('.').filter(Boolean).map((className) => `${className}${suffix}`),
            ...buildClassNames(sassNode.parent),
        ];
    });
};

module.exports = {
    meta: {
        type: 'suggestion',
        schema: [{
            type: 'object',
            properties: {
                sassRoot: {
                    type: 'string',
                },
            },
        }],
        docs: {
            description: 'Enforce matching JSX and SASS directory structures.',
        },
        messages: {
            mismatch: 'There should be a matching SASS file here: {{ path }}',
            missingClassName: 'This class name is not present in the matching SASS file: {{ path }}',
        },
    },
    create: (context) => {
        const classNameNodes = [];
        const { sassRoot } = context.options[0];

        return {
            JSXAttribute: (node) => {
                if (node.name.name === 'className') {
                    classNameNodes.push(node);
                }
            },
            'Program:exit': (node) => {
                if (classNameNodes.length === 0) {
                    return;
                }

                const jsxDirectory = context.filename.replace(`${context.cwd}/client/script/`, '');

                if (!jsxDirectory.startsWith('components/')) {
                    return;
                }

                const jsxSubDirectory = jsxDirectory.replace('components/', '');
                const sassSubDirectory = jsxSubDirectory
                    .split('/')
                    .map((part) => `${part[0].toLowerCase()}${part.slice(1).replace(/([A-Z])/g, '-$1').toLowerCase()}`)
                    .join('/')
                    .replace('.jsx', '.sass');
                const sassDirectory = `${sassRoot}/${sassSubDirectory}`;

                if (!fs.existsSync(`${context.cwd}/${sassDirectory}`)) {
                    context.report({
                        node,
                        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } },
                        messageId: 'mismatch',
                        data: {
                            path: sassDirectory,
                        },
                    });

                    return;
                }

                const sass = fs.readFileSync(`${context.cwd}/${sassDirectory}`, { encoding: 'utf8' });
                const result = postcss().process(sass, { syntax: postcssSass });
                let classNames = [];

                result.root.walkRules((rule) => {
                    if (rule.nodes.some((childNode) => childNode.type === 'rule' && childNode.selector[0] !== '@')) {
                        return;
                    }

                    const newClassNames = buildClassNames(rule);

                    classNames = [...classNames, ...newClassNames];
                });

                classNameNodes.forEach((classNameNode) => {
                    findClassNames(classNameNode.value).forEach(({ className, node: childNode }) => {
                        if (className === extractBemBlock(className)) {
                            return;
                        }

                        const classNameWithoutVariable = className.match(/(.*)variable/)?.[1];

                        if (
                            (classNameWithoutVariable && !classNames.some((item) => item.startsWith(classNameWithoutVariable)))
                            || (!classNameWithoutVariable && !classNames.includes(className))
                        ) {
                            context.report({
                                node: childNode,
                                messageId: 'missingClassName',
                                data: {
                                    path: sassDirectory,
                                },
                            });
                        }
                    });
                });
            },
        };
    },
};
