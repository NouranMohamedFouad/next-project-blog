"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-14">
          <h1 className="text-5xl font-extrabold tracking-wide">All Posts</h1>
          <a
            href="/posts/new"
            className="bg-blue-600 hover:bg-blue-700 transition rounded-full px-8 py-3 font-semibold text-lg text-white shadow-lg"
          >
            + New Post
          </a>
        </header>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center text-xl italic mt-20">
            No posts available yet.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {posts.map((post: any) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 w-full"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-blue-600">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
                    {post.content}
                  </p>
                </div>

                <footer className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium tracking-wide select-none">
                    {post.author?.name ?? "Anonymous"}
                  </span>

                  <div className="flex gap-6 text-lg font-semibold">
                    <a
                      href={`/posts/${post.id}`}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Delete
                    </button>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
