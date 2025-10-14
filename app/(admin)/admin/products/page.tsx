"use client"
import React, { useState, useEffect } from "react";
import ProductTable from "./_components/ProductTable";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { Product } from "./types/product";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [deleteId, setDeleteId] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(5);

  const API = "http://localhost:3000/api/products";

  const getProductsData = async (page = 1) => {
    try {
      const res = await axios.get<{ products: Product[]; totalPages: number; totalProducts: number }>(`${API}?page=${page}&limit=${limit}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalCount(res.data.totalProducts || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProductsData(currentPage);
  }, [currentPage]);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.patch(`${API}/${deleteId}/soft-delete`);
      toast.info("Product deleted!", { autoClose: 1000, hideProgressBar: true });
      setShowDeleteModal(false);
      setDeleteId("");
      getProductsData(currentPage);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-2xl px-7 pt-3 mx-5 my-7">
        <div className="flex justify-between my-4">
          <h1 className="font-semibold text-2xl my-1">Products</h1>
          <Link href="products/add">
            <button className="h-10 px-4 bg-gray-800 text-white rounded-4xl flex items-center cursor-pointer">
              Add Product
            </button>
          </Link>
        </div>

        <ProductTable
          products={products}
          confirmDelete={confirmDelete}
          currentPage={currentPage}
          limit={limit}
        />

        <div className="flex items-center justify-between py-5 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} results
          </span>
          <div className="flex gap-4 [&>*]:cursor-pointer">
            <button
              onClick={() => goToPage(1)}
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
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="disabled:cursor-not-allowed disabled:bg-gray-300 px-3 py-1 text-sm text-white bg-gray-800 hover:bg-gray-950 border rounded-md"
            >
              Prev
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300 bg-gray-800 hover:bg-gray-950 border rounded-md"
            >
              Next
            </button>
            <button
              onClick={() => goToPage(totalPages)}
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

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[100]">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
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

export default ProductsPage;