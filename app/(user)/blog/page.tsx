"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";


interface BlogData {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
}


const Blog = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [posts, setPosts] = useState<BlogData[]>([]);
  const API = `${API_BASE_URL}/api/blogs`;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(API);
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="mx-20 px-6 py-16">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-6">Our Blog</h1>
      <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
        Explore our latest articles on fashion, styling tips, and lifestyle to
        stay inspired and updated.
      </p>

      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={`${API_BASE_URL}${post.image}`}
                alt={post.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-gray-500 text-sm italic">
                    {new Date(post.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.description}
                </p>
                <Link
                  href={`/blog/${post._id}`}
                  className="text-purple-600 font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No blogs available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Blog;
