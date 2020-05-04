import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import styled from 'styled-components';

const PreviewContainer = styled.div`
  padding: 2rem;
  width: 50%;
`;

type PreviewProps = {
  children: React.ReactNode
  options?: {
    [option: string]: any
  }
};

const Preview = ({ children, options }: PreviewProps): JSX.Element => {
  return (
    <PreviewContainer>
      <Markdown options={{ ...options }}>
        {children}
      </Markdown>
    </PreviewContainer>
  );
};

export default Preview;