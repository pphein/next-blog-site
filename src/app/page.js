import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import Image from "next/image";

export async function fetchPosts() {
  const res = await fetch('http://localhost:3000/api/post', { cache: 'no-store' })
  return res.json()
}

export default async function Home() {
  const posts = await fetchPosts()
  return (
    <main className="max-w-screen-sm m-auto">
      <Hero />
      <div>
        {/* {posts?.length > 0 && <h2 className="text-center">The Blog Spot</h2>} */}
        {
          posts?.length > 0
            ? posts.map((post) =>
              (<PostCard key={post._id} post={post} />)
            )
            : (<h3>Post will be loaded soon</h3>)
        }
      </div>
    </main>
  );
}
