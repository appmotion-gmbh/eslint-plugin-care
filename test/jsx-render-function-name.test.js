const { RuleTester } = require('eslint');
const rule = require('../rules/jsx-render-function-name');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        ecmaFeatures: {
            jsx: true,
        },
    },
});

ruleTester.run('jsx-render-function-name', rule, {
    valid: [{
        code: `
            const Component = () => {
                const a = 'b';

                const renderSomething = () => (
                    <div />
                );

                const someFunction = () => (
                    'someValue'
                );

                return (
                    <div>
                        <span />
                    </div>
                );
            };
        `,
    }, {
        code: `
            const render = (AppComponent) => {
                const root = createRoot(document.getElementById('app'));

                root.render((
                    <LocalStorageProvider>
                        {(localStorageRef) => (
                            <Router history={history}>
                                <ErrorBoundary>
                                    <ApolloProvider client={createApolloClient(localStorageRef)}>
                                        <AppComponent />
                                    </ApolloProvider>
                                </ErrorBoundary>
                            </Router>
                        )}
                    </LocalStorageProvider>
                ));
            };
        `,
    }],
    invalid: [{
        code: `
            const Component = () => {
                const a = 'b';

                const something = () => (
                    <div />
                );

                return (
                    <div>
                        <span />
                    </div>
                );
            };
        `,
        errors: [{
            messageId: 'wrongName',
        }],
    }],
});
