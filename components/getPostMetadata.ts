import fs from "fs";
import matter from "gray-matter";
import { PostMetadata } from "./PostPreview";

const getPostMetadata = (): PostMetadata[] => {
  const folder = "posts/";
  const files = fs.readdirSync(folder);
  const markdownPosts = files.filter((file) => file.endsWith(".md"));
  markdownPosts.sort((a, b) => {
    const fileA = fs.readFileSync(`posts/${a}`, "utf8");
    const fileB = fs.readFileSync(`posts/${b}`, "utf8");
    const matterResultA = matter(fileA);
    const matterResultB = matter(fileB);
    const dateA = new Date(matterResultA.data.date).getTime();
    const dateB = new Date(matterResultB.data.date).getTime();
    return dateB - dateA;
  });
  const posts = markdownPosts.map((fileName: string) => {
    const fileContents = fs.readFileSync(`posts/${fileName}`, "utf8");
    const matterResult = matter(fileContents);

    return {
      title: matterResult.data.title,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      category: matterResult.data.category,
      tags: matterResult.data.tags,
      slug: fileName.replace(".md", ""),
    };
  });

  return posts;
}

export default getPostMetadata;