import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Preview from './Preview';

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

const MarkdownPreview = styled(Preview)`
    background: #f3f3f3;
    height: 100%;
`;

type MarkdownEditorProps = {
    placeholder?: string;
};

const useDebounce = (initValue: string, delay: number): string => {
    const [value, setValue] = useState(initValue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setValue(initValue);
        }, delay);

        return () => clearTimeout(timeout);
    }, [initValue, delay]);

    return value;
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
            <MarkdownPreview options={{ forceBlock: true }} data-testid="markdown-preview">
                {debouncedVal}
            </MarkdownPreview>
        </Container>
    );
};

export default MarkdownEditor;
