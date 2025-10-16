"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import EditCat from "./EditCat";
import CatTable from "./CatTable";

interface Category {
  _id: string;
  category: string;
  image: string;
  createdAt: string;
}

interface FormValues {
  category: string;
  image: FileList;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesId, setCategoriesId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showEditModal, setEditShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");

  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


  const API = `${API_BASE_URL}/api/categories`;

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm<FormValues>();

  const getCategoryData = async (page = 1) => {
    try {
      const res = await axios.get(`${API}?page=${page}&limit=${limit}`);
      setCategories(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.totalItems);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/${deleteId}`);
      toast.info("Category deleted!", { autoClose: 1000 });
      setShowDeleteModal(false);
      setDeleteId("");
      getCategoryData(currentPage);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setCategoriesId(category._id);
    resetEdit({ category: category.category });
    setEditShowModal(true);
  };

  const submitEdit: SubmitHandler<FormValues> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("category", data.category);
      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      if (selectedCategory) {
        await axios.put(`${API}/${categoriesId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category updated!", { autoClose: 1000 });
      } else {
        await axios.post(API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category added successfully!", { autoClose: 1000 });
      }

      setEditShowModal(false);
      setTimeout(() => getCategoryData(currentPage), 200);
    } catch (error) {
      console.log("Error updating category:", error);
    }
  };

  useEffect(() => {
    getCategoryData(currentPage);
  }, [limit, currentPage]);

  return (
    <div className="my-7">
      {/* Header */}
      <div className="bg-white rounded-2xl px-7 pt-7 mx-5">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-2xl my-1">Categories</h1>
          <div>
            <label htmlFor="lim">Show </label>
            <select
              id="lim"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-100 rounded-lg mx-2 outline-0"
            >
              {[5, 6, 7, 10].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <span> results per page</span>
          </div>

          <button
            className="h-10 px-4 bg-gray-800 text-white rounded-4xl"
            onClick={() => {
              setSelectedCategory(null);
              resetEdit({ category: "", image: undefined as any });
              setEditShowModal(true);
            }}
          >
            Add Category
          </button>
        </div>

        {/* Table */}
        <CatTable
          Category={categories}
          confirmDelete={confirmDelete}
          handleEdit={handleEdit}
          currentPage={currentPage}
          limit={limit}
        />

        <div className="">
          <div className="flex items-center justify-between py-5  border-gray-200 bg-white border-t-1">
            <span className="text-sm text-gray-600">
              Showing {(currentPage - 1) * limit + 1} to{" "}
              {Math.min(currentPage * limit, totalCount)} of {totalCount}{" "}
              results
            </span>

            <div className="flex gap-4 [&>*]:cursor-pointer">
              {/* First */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-600 bg-white hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>

              </button>

              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="disabled:cursor-not-allowed disabled:bg-gray-300 px-3 py-1 text-sm text-white bg-gray-800 hover:bg-gray-950 border rounded-md"
              >
                Prev
              </button>

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300 bg-gray-800 hover:bg-gray-950 border rounded-md"
              >
                Next
              </button>

              {/* Last */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="disabled:text-gray-300 disabled:cursor-not-allowed px-3 py-1 text-sm text-gray-600 bg-white rounded-md hover:bg-gray-100"
              >
                 <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
              </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Section */}

      {/* Modal */}
      <EditCat
        show={showEditModal}
        onClose={() => setEditShowModal(false)}
        category={selectedCategory}
        onSubmit={submitEdit}
        register={registerEdit}
        handleSubmit={handleSubmitEdit}
        errors={errorsEdit}
        reset={resetEdit}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this category?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;