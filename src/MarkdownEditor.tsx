import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useDebounce, useUndoRedo, useEventListener } from './hooks';
import MarkdownPreview from './MarkdownPreview';

const headerHeight = '4.375rem';
const headerHeightSm = '3.25rem';

const Container = styled.div`
    height: calc(100% - ${headerHeight});
    box-sizing: border-box;
    display: flex;

    @media (max-width: 960px) {
        flex-direction: column;
        height: calc(100% - ${headerHeightSm});
    }
`;

const Textarea = styled.textarea`
    font-family: inherit;
    font-size: inherit;
    resize: none;
    padding: 2rem;
    height: 100%;
    width: 50%;
    border: none;

    &:focus {
        outline: none;
    }

    @media (max-width: 960px) {
        width: 100%;
        height: 50%;
    }
`;

const Header = styled.header`
    background-color: #0077FF;
    padding: 1rem 2rem;
    height: ${headerHeight};

    > h1 {
        margin: 0;
        color: #ffffff;
    }

    @media (max-width: 960px) {
        height: ${headerHeightSm};

        > h1 {
            font-size: 1.125rem;
        }
    }
`;

type MarkdownEditorProps = {
    placeholder?: string;
};

// Need to extend Event because KeyboardEvent is not compatible with Event
interface CustomKBEvent extends Event {
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    key?: string;
}

const getCommand = (e: CustomKBEvent): string => {
    const { ctrlKey, metaKey, shiftKey, key } = e;
    if (ctrlKey || metaKey) {
        if (key === 'z') {
            return shiftKey ? 'redo' : 'undo';
        }
        return '';
    }
    return '';
};

const MarkdownEditor = ({ placeholder = '' }: MarkdownEditorProps): JSX.Element => {
    const [content, setContent] = useState('');
    const debouncedVal = useDebounce(content, 25);
    const [currContent, undo, redo, set] = useUndoRedo(debouncedVal);
    const handleKeydown: EventListener = (e: CustomKBEvent) => {
        const command = getCommand(e);
        if (command === 'undo') {
            undo();
            e.preventDefault();
        } else if (command === 'redo') {
            redo();
            e.preventDefault();
        }
    };

    useEffect(() => {
        if (debouncedVal !== currContent) {
            set(debouncedVal);
        }
    }, [debouncedVal]);

    useEventListener('keydown', handleKeydown);

    return (
        <>
            <Header>
                <h1>Super Awesome Markdown Editor</h1>
            </Header>
            <Container>
                <Textarea
                    data-testid="markdown-textarea"
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setContent(e.target.value)}
                    value={currContent}
                    placeholder={placeholder} />
                <MarkdownPreview options={{ forceBlock: true }}>
                    {currContent}
                </MarkdownPreview>
            </Container>
        </>
    );
};

export default MarkdownEditor;
