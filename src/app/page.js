"use client";

import { useState, useEffect } from "react";
import {RotatingLines} from "react-loader-spinner";
import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/api/post`, { cache: 'no-store' });
      const data = await res.json();
      setPosts(data);
    }
    loadPosts();
  }, []);

  return (
    <main className="max-w-screen-sm m-auto">
      <Hero />
      <div>
        {
          posts?.length > 0
            ? posts.map((post) =>
              (<PostCard key={post._id} post={post} />)
            )
            : (
            <div className="flex items-center justify-center">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="96"
                  visible={true}
                />
              </div>
          )
        }
      </div>
    </main>
  );
}
