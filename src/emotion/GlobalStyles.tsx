import { FC } from 'react';
import { Global, css } from '@emotion/react';
import emotionNormalize from 'emotion-normalize';

const styles = css`
  ${emotionNormalize}

  body {
    min-height: 100vh;
  }
`;

const GlobalStyles: FC = ({ children }) => (
  <>
    <Global styles={styles} />
    {children}
  </>
);

export default GlobalStyles;
