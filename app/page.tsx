import PostPreview from "@/components/PostPreview";
import getPostMetadata from "@/components/getPostMetadata";

const ListPage = () => {
  const postMetadata = getPostMetadata();
  const postPreviews = postMetadata.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));
  return (
    <div className="page">
      {postPreviews}
    </div>
  );
}

export default ListPage;