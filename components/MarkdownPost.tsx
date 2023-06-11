"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import ReactMarkdown, { Options } from "react-markdown";
import RankBadge from "./RankBadge";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const modifiedOneLight = {
  ...oneLight,
  hljs: { backgroundColor: "transparent" },
};

interface Props {
  post: string;
}

const MarkDownPost: React.FunctionComponent<Props> = ({ post }) => {
  const renderers = {
    inlineMath: ({ value }: any) => <span dangerouslySetInnerHTML={{ __html: `\\(${value}\\)` }} />,
    math: ({ value }: any) => <div dangerouslySetInnerHTML={{ __html: `\\[${value}\\]` }} />
  }

  const components: Options["components"] = {
    ...renderers,
    a: ({ href, children, ...props }: any) => {
      if (href.startsWith("@")) {
        const [name, color, rank] = children[0].split("#");
        const link = `${href.substring(1)}${rank}`;
        return (
          <RankBadge rank={rank} color={color} name={name} link={link} {...props} />
        );
      }
      return <a href={href} {...props}>{children}</a>;
    },
    img: (image: any) => (
      <Image
        src={image.src || ""}
        alt={image.alt || ""}
        width={600}
        height={250}
        layout="responsive"
      />
    ), 
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          language={match[1]}
          PreTag="div"
          {...props}
          style={modifiedOneLight}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code {...props}>{children}</code>
      );
    },
  };

  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        skipHtml={false}
        components={components}
      >
        {post}
      </ReactMarkdown>
    </div>
  );
};
  
export default MarkDownPost;