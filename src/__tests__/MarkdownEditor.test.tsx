import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MarkdownEditor from '../MarkdownEditor';

import markdownPreviews from '../__fixtures__/markdownPreviews';

test('It should render an input with placeholder', () => {
    const placeholderText = 'foobar';
    const { getByTestId } = render(<MarkdownEditor placeholder={placeholderText} />);
    const textareaInput = getByTestId('markdown-textarea');

    expect(textareaInput.placeholder).toEqual(placeholderText);
});

const setup = () => {
    const utils = render(<MarkdownEditor />);
    const textarea = utils.getByTestId('markdown-textarea');
    const preview = utils.getByTestId('markdown-preview');

    return {
        textarea,
        preview,
        ...utils,
    };
};

test.each(markdownPreviews)('It should correctly render preview for %s', async(testName, input, output) => {
    const { textarea, preview } = setup();

    fireEvent.change(textarea, { target: { value: input } });

    await waitFor(() => {
        const condensedHtml = preview.innerHTML.replace(/\>[\s|\n]+\</gm, '><').trim();
        expect(condensedHtml).toBe(output);
    }, { container: preview, timeout: 4750 });
});
