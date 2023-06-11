interface TagProps { children: string; }

const Tag = (props: TagProps) => (
  <span className="tag">#{props.children}</span>
);

export default Tag;