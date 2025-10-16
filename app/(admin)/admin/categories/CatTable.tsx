import React from "react";

interface Category {
  _id: string;
  category: string;
  image: string;
  createdAt: string;
}

interface CatTableProps {
  Category: Category[];
  handleEdit: (category: Category) => void;
  confirmDelete: (id: string) => void;
  currentPage: number;
  limit: number;
}

const CatTable: React.FC<CatTableProps> = ({
  Category,
  handleEdit,
  confirmDelete,
  currentPage,
  limit,
}) => {

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <table className="bg-white rounded-2xl rounded-b-none mt-7 w-full">
      <thead>
        <tr className="text-left text-sm uppercase border-y border-gray-100 text-gray-600">
          <th className="text-center font-medium">#</th>
          <th className="p-4 font-medium">Image</th>
          <th className="p-4 font-medium">Name</th>
          <th className="p-4 font-medium">Date</th>
          <th className="p-4 text-right font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Category.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-4 text-center text-gray-500 italic">
              No Data
            </td>
          </tr>
        ) : (
          Category.map((category, index) => (
            <tr key={category._id} className="hover:bg-gray-50 bg-white">
              <td className="text-center px-2">
                {(currentPage - 1) * limit + index + 1}
              </td>
              <td className="p-4">
                <img
                  src={`${API_BASE_URL}${category.image}`}
                  alt={category.category}
                  className="h-13 w-13 object-cover"
                />
              </td>
              <td className="p-4">{category.category}</td>
              <td className="p-4">
                {new Date(category.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="p-4 flex gap-3 justify-end">
                <button
                  className="rounded-full p-1.5 bg-red-600 text-white hover:bg-white hover:text-red-600"
                  onClick={() => confirmDelete(category._id)}
                >
                   <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 
                        2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 
                        0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 
                        0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 
                        0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                </button>
                <button
                  className="rounded-full p-1.5 bg-indigo-800 text-white hover:bg-white hover:text-indigo-800"
                  onClick={() => handleEdit(category)}
                >
                      <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 
                      2.828l-.793.793-2.828-2.828.793-.793zM11.379 
                      5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default CatTable;
