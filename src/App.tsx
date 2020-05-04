import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import MarkdownEditor from './MarkdownEditor';

const GlobalStyle = createGlobalStyle`
    html, body {
        margin: 0;
        font-family:  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    html, body, #root {
        height: 100%;
    }

    * {
        box-sizing: border-box;
    }

    ::-webkit-scrollbar {
        width: .625rem;
        height: .625rem;
    }

    ::-webkit-scrollbar, ::-webkit-scrollbar-track {
        background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #bdbebf;
        border-radius: .25rem;
    }

    ul {
        margin: 2rem 0;
        li:not(:last-of-type) {
            margin-bottom: .5rem;
        }
    }

    code {
        padding: .15rem .25rem;
        background-color: #d3d4d4;
        border-radius: 2px;
        font-size: .9rem;
    }

    p {
        font-size: 1rem;
        line-height: 1.5;
        margin: 1.5rem 0;

        code {
            font-size: 1.125rem;
        }
    }

    pre {
        overflow-x: auto;
        background-color: #d3d4d4;
        padding: 1rem;

        code {
            background-color: transparent;
        }
    }
`;

const AppContainer = styled.div`
    height: 100%;
`;

class App extends Component {
    render() {
        return (
            <>
                <GlobalStyle />
                <AppContainer>
                    <MarkdownEditor placeholder="Start writing your Markdown..." />
                </AppContainer>
            </>
        );
    }
}

export default App;
