"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BlogTable from "./_components/BlogTable";
import AddBlog from "./_components/AddBlog";
import { Blog } from "./types/blog";

const BlogIndex: React.FC = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API = `${API_BASE_URL}/api/blogs`;

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [blogData, setBlogData] = useState<Blog[]>([]);

  // Fetch all blogs
  const getBlogData = async () => {
    try {
      const res = await axios.get<Blog[]>(API);
      setBlogData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch blogs!");
    }
  };

  useEffect(() => {
    getBlogData();
  }, []);

  // Handle Add/Edit submit
  const onSubmitAdd = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      if (selectedBlog) {
        await axios.put(`${API}/${selectedBlog._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Blog updated successfully!");
      } else {
        await axios.post(API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Blog added successfully!");
      }

      setShowAddModal(false);
      setSelectedBlog(null);
      getBlogData(); // refresh table
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog!");
    }
  };

  return (
    <div>
      <div className="bg-white rounded-2xl px-7 pt-7 mx-5 my-7">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-2xl my-1 mx-4">Blogs</h1>
          <button
            className="h-10 px-4 bg-gray-800 text-white rounded-4xl flex items-center cursor-pointer"
            onClick={() => {
              setSelectedBlog(null);
              setShowAddModal(true);
            }}
          >
            Add Blog
          </button>
        </div>

        {/* Table */}
        <BlogTable
          blogs={blogData}
          onEdit={(blog) => {
            setSelectedBlog(blog);
            setShowAddModal(true);
          }}
          onRefresh={getBlogData}
        />
      </div>

      {/* Add/Edit Blog Modal */}
      <AddBlog
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={onSubmitAdd}
        blog={selectedBlog}
      />
    </div>
  );
};

export default BlogIndex;
