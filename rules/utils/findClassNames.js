/*
eslint-disable
    eslint-plugin/prefer-message-ids,
    eslint-plugin/prefer-object-rule,
    eslint-plugin/require-meta-type,
    eslint-plugin/require-meta-schema
*/
module.exports = (node) => {
    if (node.type === 'Literal') {
        return node.value.split(' ').map((className) => ({
            className,
            node,
        }));
    }

    if (node.type === 'JSXExpressionContainer') {
        return node.expression.arguments.reduce((result, argument) => {
            if (argument.type === 'Literal') {
                return [
                    ...result,
                    { className: argument.value, node: argument },
                ];
            }

            if (argument.type === 'TemplateLiteral') {
                return [
                    ...result,
                    { className: argument.quasis.map(({ value }) => value.raw).join('variable'), node: argument },
                ];
            }

            if (argument.type === 'ObjectExpression') {
                return [
                    ...result,
                    ...argument.properties.map((property) => {
                        const className = property.key.type === 'TemplateLiteral'
                            ? property.key.quasis.map(({ value }) => value.raw).join('variable')
                            : property.key.value;

                        return { className, node: property };
                    }),
                ];
            }

            return result;
        }, []);
    }

    return [];
};
