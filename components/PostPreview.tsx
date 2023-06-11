import Link from "next/link";
import React from "react";
import Tag from "./Tag";
import Category from "./Category";

export interface PostMetadata {
  title: string;
  date: string;
  subtitle: string;
  category: string;
  tags: string[];
  slug: string;
}

const PostPreview = (props: PostMetadata) => {
  let dateStr = "";
  if (props.date) {
    const postDate = new Date(props.date);
    const now = new Date();
  
    const diffTime = Math.abs(now.getTime() - postDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays < 30) {
      dateStr = `${diffDays}일 전`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      dateStr = `${diffMonths}달 전`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      dateStr = `${diffYears}년 전`;
    }
  }

  return (
    <div className="post-tile">
      <Link href={`/posts/${props.slug}`}>
        <h2>{props.title}</h2>
      </Link>
      {props.date && <p className="date">{dateStr}</p>}
      <Category>{props.category}</Category>
      <p>
        {props.tags.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))}
      </p>
      <p>{props.subtitle}</p>
    </div>
  );
};


export default PostPreview;