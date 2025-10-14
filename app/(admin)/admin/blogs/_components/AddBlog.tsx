import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Blog } from "../types/blog";

interface AddBlogProps {
  show: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<FormValues>;
  blog: Blog | null;
}

interface FormValues {
  title: string;
  description: string;
  image: FileList;
}

const AddBlog: React.FC<AddBlogProps> = ({ show, onClose, onSubmit, blog }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (show) {
      if (blog) {
        reset({
          title: blog.title,
          description: blog.description,
        });
      } else {
        reset();
      }
    }
  }, [show, blog, reset]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {blog ? "Edit Blog" : "Add New Blog"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={5}
              {...register("description", { required: "Description is required" })}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input type="file" accept="image/*" {...register("image")} />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg"
            >
              {blog ? "Update Blog" : "Save Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
