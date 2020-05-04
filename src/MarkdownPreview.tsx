import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import styled from 'styled-components';

const PreviewContainer = styled.div`
  background: #f3f3f3;
  padding: 2rem;
  width: 50%;
`;

type PreviewProps = {
  children: React.ReactNode
  options?: {
    [option: string]: any
  }
};

const MarkdownPreview = ({ children, options }: PreviewProps): JSX.Element => (
  <PreviewContainer>
    <Markdown options={{ ...options }} data-testid="markdown-preview">
      {children}
    </Markdown>
  </PreviewContainer>
);

export default MarkdownPreview;