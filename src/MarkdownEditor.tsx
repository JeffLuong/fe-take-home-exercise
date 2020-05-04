import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useDebounce, useUndoRedo, useEventListener } from './hooks';

import MarkdownPreview from './MarkdownPreview';

const Container = styled.div`
    height: 100%;
    box-sizing: border-box;
    display: flex;
    padding: 2rem;
`;

const Textarea = styled.textarea`
    font-family: inherit;
    font-size: inherit;
    resize: none;
    padding: 2rem;
    width: 50%;
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
    );
};

export default MarkdownEditor;
