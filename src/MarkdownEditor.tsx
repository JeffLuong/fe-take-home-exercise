import React, { useState } from 'react';
import styled from 'styled-components';

import { useDebounce } from './hooks';

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

const MarkdownEditor = ({ placeholder = '' }: MarkdownEditorProps): JSX.Element => {
    const [content, setContent] = useState('');
    const debouncedVal = useDebounce(content, 25);
    return (
        <Container>
            <Textarea
                data-testid="markdown-textarea"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => setContent(e.target.value)}
                value={debouncedVal}
                placeholder={placeholder} />
            <MarkdownPreview options={{ forceBlock: true }}>
                {debouncedVal}
            </MarkdownPreview>
        </Container>
    );
};

export default MarkdownEditor;
