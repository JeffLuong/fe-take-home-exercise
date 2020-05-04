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
    display: flex;
    justify-content: space-between;

    > h1 {
        margin: 0;
        color: #ffffff;
    }

    @media (max-width: 960px) {
        height: ${headerHeightSm};
        padding: .5rem 2rem;

        > h1 {
            font-size: 1.5rem;
            line-height: 1.5;
        }
    }
`;


const Tooltip = styled.div`
    background-color: #001733;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 75%);
    padding: .5rem .75rem;
    border-radius: 3px;
    display: none;
`;

const Button = styled.button`
    background-color: #005fcc;
    border: 1px solid #005fcc;
    border-bottom: 3px solid #004799;
    border-radius: 4px;
    color: #ffffff;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 700;
    padding: .25rem .75rem;
    position: relative;
    outline: none;
    height: 100%;

    &:active {
        border-bottom: 1px solid #005fcc;
        transform: translateY(2px);
    }

    &:hover {
        &:not(:active) > ${Tooltip} {
            display: block;
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
    const debouncedVal = useDebounce(content, 15);
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
                <h1>Awesome MD Editor</h1>
                <div style={{ display: 'flex' }}>
                    <Button
                        type="button"
                        onClick={() => undo()}
                        style={{ marginRight: '1rem' }}>
                        Undo
                        <Tooltip>(⌘+z)</Tooltip>
                    </Button>
                    <Button
                        type="button"
                        onClick={() => redo()}>
                        Redo
                        <Tooltip>(⌘+⇧+z)</Tooltip>
                    </Button>
                </div>
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
