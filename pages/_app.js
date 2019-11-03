/**
 * Copied from styled-components example from next.js
 * Wraps every page around a theme provider
 */

import App from 'next/app';
import React from 'react';
import withRedux from 'next-redux-wrapper';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import store from '../data/store';
import theme from '../components/theme';

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        return (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </ThemeProvider>
        );
    }
}

export default withRedux(() => store)(MyApp);
