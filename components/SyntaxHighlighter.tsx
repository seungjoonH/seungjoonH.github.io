import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function MyComponent() {
  const pythonCode = `print("Hello, World!")`;
  const cCode = `printf("Hello, World!");`;
  
  return (
    <>
      <SyntaxHighlighter language="python" style={atomOneDark}>
        {pythonCode}
      </SyntaxHighlighter>
      <SyntaxHighlighter language="c" style={atomOneDark}>
        {cCode}
      </SyntaxHighlighter>
    </>
  );
}