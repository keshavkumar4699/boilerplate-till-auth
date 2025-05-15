// app/posts/page.js (Server Component)
import Header from "@/components/Header/Header";
import PostCard from "./PostCard";

async function getPosts() {
  // Fetch posts from your database/API
  const res = await fetch("https://reqres.in/api/users?page=2");
  return res.json();
}

export default async function PostsPage() {
  let api_data = await getPosts();
  const posts = api_data.data;
  return (
    <>
      <Header />
      <div className="flex flex-col items-center w-full">
        {posts.map((post) => (
          <div key={post.id} className="w-full lg:w-7/12 mb-4">
            <PostCard post={post.email} />
          </div>
        ))}
      </div>
    </>
  );
}
