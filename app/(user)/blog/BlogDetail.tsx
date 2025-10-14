"use client"
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface BlogData {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
}


const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogData>();
  const API = `http://localhost:3000/api/blogs/${id}`;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(API);
        setBlog(res.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-gray-500">Loading blog...</p>
      </div>
    );
  }

  return (
    <div className="mx-20 px-6 py-16">
      <img
        src={`http://localhost:3000${blog.image}`}
        alt={blog.title}
        className="w-full h-96 object-cover rounded-2xl mb-8"
      />
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-600 mb-6">
        {new Date(blog.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
      <p className="text-lg text-gray-700 leading-relaxed">{blog.description}</p>
    </div>
  );
};

export default BlogDetail;
