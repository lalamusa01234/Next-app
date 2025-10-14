"use client"
import React from "react";
import Link from "next/link";
import { Product } from "../types/product";

interface ProductTableProps {
  products: Product[];
  confirmDelete: (id: string) => void;
  currentPage: number;
  limit: number;
}

const ProductTable = ({ products, confirmDelete, currentPage, limit }: ProductTableProps) => {
  const renderImage = (imageArr: string[], name: string) => {
    if (!imageArr || imageArr.length === 0) {
      return <span className="text-gray-400 italic">No Image</span>;
    }
    return (
      <img
        src={`http://localhost:3000${imageArr[0]}`}
        alt={name}
        className="h-13 w-13 object-cover rounded"
      />
    );
  };

  const renderDiscount = (product: Product) => {
    if (!product.discountValue) return "N/A";
    return `${product.discountValue} ${product.discountType === "percentage" ? "%" : "Flat"}`;
  };

  return (
    <div className="bg-white rounded-2xl rounded-t-none overflow-x-auto">
      <table className="min-w-full bg-white my-3">
        <thead>
          <tr className="text-left text-sm uppercase border-y border-gray-100 text-gray-600">
            <th className="text-center">#</th>
            <th className="p-4">Image</th>
            <th className="p-4">Product Name</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4">Discount</th>
            <th className="p-4">Final Price</th>
            <th className="p-4">Quantity</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {products?.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-4 text-center text-gray-500 italic">
                No Products Found
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-2 text-center">{(currentPage - 1) * limit + index + 1}</td>
                <td className="p-4">{renderImage(product.image, product.name)}</td>
                <td className="p-4">{product.name || "N/A"}</td>
                <td className="p-4">{typeof product.category === "object" ? product.category?.category || "N/A" : "N/A"}</td>
                <td className="p-4">{product.price ?? "N/A"}</td>
                <td className="p-4">{renderDiscount(product)}</td>
                <td className="p-4">{product.finalPrice ?? "N/A"}</td>
                <td className="p-4">{product.quantity ?? "N/A"}</td>
                <td className="p-4 flex gap-3 justify-end">
                  <button
                    onClick={() => confirmDelete(product._id)}
                    className="cursor-pointer rounded-full p-1.5 bg-red-600 text-white hover:bg-white hover:text-red-600 shadow"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <Link href={`products/edit/${product._id}`}>
                    <div className="cursor-pointer rounded-full p-1.5 bg-indigo-800 text-white hover:bg-white hover:text-indigo-800 shadow">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;