import MarkdownPost from "@/components/MarkdownPost";
import getPostMetadata from "@/components/getPostMetadata";
import fs from "fs";
import matter from "gray-matter";

const getPostContent = (slug: string) => {
  const folder = "posts/";
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);
  return matterResult;
}

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

const PostPage = (props: any) => {
  const slug = props.params.slug;
  const post = getPostContent(slug);
  return (
    <p className="post page">
      <h1>{post.data.title}</h1>
      <MarkdownPost post={post.content} />
    </p>
  );
}

export default PostPage;