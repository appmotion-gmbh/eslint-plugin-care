const { RuleTester } = require('eslint');
const rule = require('../rules/jsx-bem');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-bem', rule, {
    valid: [{
        code: `
            const Block = () => (
                <div className="block">
                    <div className="block__element" />
                </div>
            );
        `,
    }, {
        code: `
            const SomeLongerName = () => (
                <div className="some-longer-name">
                    <div className="some-longer-name__element" />
                </div>
            );
        `,
    }, {
        code: `
            const SomeLongerName = () => (
                <div className="prefix-some-longer-name">
                    <div className="prefix-some-longer-name__element" />
                </div>
            );
        `,
    }, {
        code: `
            const Block = () => (
                <div>
                    <div className="block" />
                </div>
            );
        `,
    }, {
        code: `
            const Block = () => (
                <div>
                    <div className="block__element" />

                    <div />
                </div>
            );
        `,
    }, {
        code: `
            const Block = () => (
                <div>
                    <div className="block__element" />
                </div>
            );
        `,
    }, {
        code: `
            const Block = () => (
                <div className="block" {...spread}>
                    <div className="block__element" {...spread} />
                </div>
            );
        `,
    }, {
        code: `
            const Block = () => (
                <div>
                    {items.map((item) => (
                        <div className="block__element" />
                    ))}
                </div>
            );
        `,
    }, {
        code: `
            const Block = () => (
                <div>
                    {items.map((item) => (
                        <div className="block" />
                    ))}
                </div>
            );
        `,
    }, {
        code: `
            const Block = () => (
                <div>
                    {condition && (
                        <div className="block" />
                    )}
                </div>
            );
        `,
    }, {
        code: `
            const Block = () => (
                <div>
                    {condition && (
                        <div className="block__element" />
                    )}
                </div>
            );
        `,
    }, {
        code: `
            const Block = () => {
                const renderContent = () => (
                    <div className="block__element" />
                );

                return (
                    <div className="block">
                        <div className="block__element">
                            {renderContent()}
                        </div>
                    </div>
                );
            };
        `,
    }, {
        code: `
            const Block = () => {
                const subContent = (
                    <div className="block__element" />
                );

                const content = foo.map(subContent);

                return (
                    <div className="block">
                        <div className="block__element">
                            {content}
                        </div>
                    </div>
                );
            };
        `,
    }, {
        code: `
            const Block = (props) => {
                if (condition) {
                    return (
                        <div className="block" />
                    );
                }

                return (
                    <div className="block" />
                );
            };
        `,
    }, {
        code: `
            const Block = () => (
                <div className={classNames('block', \`block--\${modifier}\`, { 'block--mod': true })}>
                    <div className={classNames('block__element', \`block__element--\${modifier}\`, { 'block__element--mod': true })} />
                </div>
            );
        `,
    }],
    invalid: [{
        code: `
            const Block = () => (
                <div className="block">
                    <div className="block" />
                </div>
            )
        `,
        errors: [{
            messageId: 'child',
        }],
    }, {
        code: `
            const SomeLongerName = () => (
                <div className="block">
                    <div className="block__element" />
                </div>
            );
        `,
        errors: [{
            messageId: 'componentMismatch',
        }, {
            messageId: 'componentMismatch',
        }],
    }, {
        code: `
            const Block = () => {
                const renderContent = () => (
                    <div className="block" />
                );

                return (
                    <div className="block">
                        <div className="block__element">
                            {renderContent()}
                        </div>
                    </div>
                );
            };
        `,
        errors: [{
            messageId: 'child',
        }],
    }, {
        code: `
            const Block = () => (
                <div className={classNames('block__element', \`block__element--\${modifier}\`, { 'block__element--mod': true })}>
                    <div className={classNames('block', \`block--\${modifier}\`, { 'block--mod': true })} />
                </div>
            );
        `,
        errors: [{
            messageId: 'child',
        }, {
            messageId: 'child',
        }, {
            messageId: 'child',
        }],
    }, {
        code: `
            const Block = () => (
                <div className="block">
                    <div className="foo__element" />
                </div>
            )
        `,
        errors: [{
            messageId: 'componentMismatch',
        }, {
            messageId: 'blockMismatch',
        }],
    }, {
        code: `
            const Block = () => (
                <div className="block_foo" />
            )
        `,
        errors: [{
            messageId: 'componentMismatch',
        }],
    }, {
        code: `
            const Block = () => (
                <div className="block">
                    <div className="block__modi_fier" />
                </div>
            )
        `,
        errors: [{
            messageId: 'invalidClassName',
        }],
    }, {
        code: `
            const Block = (props) => {
                if (condition) {
                    return (
                        <div className="some-other-block" />
                    );
                }

                return (
                    <div className="block" />
                );
            };
        `,
        errors: [{
            messageId: 'multipleRootElements',
        }],
    }, {
        code: `
            const Block = () => (
                <div className={classNames('block', \`foo--\${modifier}\`)} />
            );
        `,
        errors: [{
            messageId: 'invalidModifier',
        }],
    }, {
        code: `
            const Block = () => (
                <div className={classNames(\`block--\${modifier}\`, 'block')}>
                    <div className="block__element" />
                </div>
            );
        `,
        errors: [{
            messageId: 'invalidModifierPosition',
        }],
    }],
});
