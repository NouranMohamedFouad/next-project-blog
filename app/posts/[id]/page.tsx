"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();

      if (data && data.userId) {
        const token = localStorage.getItem("token");

        if (token) {
          const decoded: any = JSON.parse(atob(token.split(".")[1]));
          const userId = decoded.userId;

          if (data.userId === userId) {
            setIsUser(true);
          } else {
            toast.error("Unauthorized access.", { position: "top-center" });
            setTimeout(() => {
              router.push("/");
            }, 1000);
          }
        }
      }

      setTitle(data.title);
      setContent(data.content);
    };

    if (id) fetchPost();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUser) {
      toast.error("Unauthorized update attempt.", { position: "top-center" });
      return;
    }

    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      toast.success("Post updated!", { position: "top-center" });
      setTimeout(() => router.push("/"), 1000);
    } else {
      toast.error("Update failed.", { position: "top-center" });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-center text-purple-700">
            Edit Post
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-purple-700 font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-purple-300 rounded-md px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="text-purple-700 font-medium">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full border border-purple-300 rounded-md px-4 py-2 h-32 resize-none focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition"
              disabled={!isUser}
            >
              Update Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
