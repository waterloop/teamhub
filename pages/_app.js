/**
 * Copied from styled-components example from next.js
 * Wraps every page around a theme provider
 */

import App from 'next/app';
import React from 'react';
import withReduxStore from "../frontend/store/withReduxStore"

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';

import { ThemeProvider } from 'styled-components';
import theme from '../frontend/components/theme';

import Nav from '../frontend/components/molecules/Nav';

const navItems = [
    {
        name: 'Home', link: '/dashboard'
    },
    {
        name: 'My Team', link: '/'
    },
    {
        name: 'My Profile', link: '/settings'
    },
];

class MyApp extends App {

    static async getInitialProps({ Component, ctx }) {
        return {
            pageProps: Component.getInitialProps
                ? await Component.getInitialProps(ctx)
                : {}
        };
    }

    constructor(props) {
        super(props)
        this.persistor = persistStore(props.reduxStore)
    }

    render () {
        const { Component, pageProps, router, reduxStore } = this.props;

        let index = -1;
        if (router && router.route) {
            const split = router.route.split('/')[1];
            if (split) index = navItems.findIndex(item => item.link === '/' + split[1]);
            else index = navItems.findIndex(item => item.link === '/');
        }
        
        return (
            <Provider store={reduxStore}>
                <ThemeProvider theme={theme}>
                    <PersistGate
                        loading={<Component {...pageProps} />}
                        persistor={this.persistor}
                    >
                        <Nav navItems={router.route.indexOf('/login') === -1 ? navItems : []} index={index}/>
                        <Component {...pageProps} />
                    </PersistGate>
                </ThemeProvider>
            </Provider>
        );
    }
}

export default withReduxStore(MyApp);
