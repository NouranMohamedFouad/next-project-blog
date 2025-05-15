"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

type DecodedToken = {
  userId: number;
  exp: number;
};

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserId(decoded.userId);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("You must be logged in.", { position: "top-center" });
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, userId }),
      });

      if (res.ok) {
        toast.success("Post created!", { position: "top-center" });
        setTimeout(() => router.push("/"), 1000);
      } else {
        throw new Error("Failed to create post.");
      }
    } catch {
      toast.error("Error occurred while creating the post.", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-center text-teal-700">
            Create a New Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-teal-700 font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-teal-300 rounded-md px-4 py-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="text-teal-700 font-medium">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full border border-teal-300 rounded-md px-4 py-2 h-32 resize-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Create Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
