import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


interface Order {
  _id: string;
  fname?: string;
  lname?: string;
  email?: string;
  orderNumber?: string;
  paymentMethod?: string;
  status?: string;
  total: number;
}

interface SortConfig {
  key: keyof Order | null;
  direction: "asc" | "desc";
}

const OrderTable: React.FC = () => {
  const [data, setData] = useState<Order[]>([]);
  // const navigate = useNavigate();
       const router = useRouter();


  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(5);

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const direction = sortConfig.direction === "asc" ? 1 : -1;

    switch (sortConfig.key) {
      case "orderNumber": {
        const orderA = a.orderNumber || "";
        const orderB = b.orderNumber || "";
        return direction * orderA.localeCompare(orderB);
      }

      case "total":
        return direction * ((a.total || 0) - (b.total || 0));

      case "fname": // handled through "name" grouping
      case "lname": {
        const nameA = `${a.fname || ""} ${a.lname || ""}`.toLowerCase();
        const nameB = `${b.fname || ""} ${b.lname || ""}`.toLowerCase();
        return direction * nameA.localeCompare(nameB);
      }

      case "email": {
        const emailA = a.email?.toLowerCase() || "";
        const emailB = b.email?.toLowerCase() || "";
        return direction * emailA.localeCompare(emailB);
      }

      case "status": {
        const statusA = a.status?.toLowerCase() || "";
        const statusB = b.status?.toLowerCase() || "";
        return direction * statusA.localeCompare(statusB);
      }

      case "paymentMethod": {
        const payA = a.paymentMethod?.toLowerCase() || "";
        const payB = b.paymentMethod?.toLowerCase() || "";
        return direction * payA.localeCompare(payB);
      }

      default:
        return 0;
    }
  });

  const handleSort = (key: keyof Order) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const API = "http://localhost:3000/api/orders";

  const getOrdersData = async (page = 1) => {
    try {
      const res = await axios.get<{
        data: Order[];
        totalPages: number;
        totalOrders: number;
      }>(`${API}?page=${page}&limit=${limit}`);
      setData(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.totalOrders);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFirst = () => setCurrentPage(1);

  const handleLast = () => setCurrentPage(totalPages);

  useEffect(() => {
    getOrdersData(currentPage);
  }, [currentPage]);

  return (
    <div>
      <div className="bg-white px-7 rounded-2xl rounded-t-none overflow-x-auto">
        <table className="min-w-full bg-white my-3">
          <thead>
            <tr className="text-left text-sm uppercase border-y border-gray-100 text-gray-600">
              <th className="p-4">#</th>
              <th className="p-4 cursor-pointer" onClick={() => handleSort("fname")}>
                Customer{" "}
                {sortConfig.key === "fname" || sortConfig.key === "lname"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th className="p-4 cursor-pointer" onClick={() => handleSort("email")}>
                Email{" "}
                {sortConfig.key === "email"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("orderNumber")}
              >
                Order Number{" "}
                {sortConfig.key === "orderNumber"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("paymentMethod")}
              >
                Payment{" "}
                {sortConfig.key === "paymentMethod"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th
                className="p-4 cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status{" "}
                {sortConfig.key === "status"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
              <th
                className="p-4 cursor-pointer text-right"
                onClick={() => handleSort("total")}
              >
                Total{" "}
                {sortConfig.key === "total"
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((order, index) => (
              <tr
                onClick={() => router.push(`/admin/orders/${order._id}`)}
                key={order._id}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-4">{(currentPage - 1) * limit + index + 1}</td>
                <td className="p-4">
                  {order.fname || "N/A"} {order.lname || "N/A"}
                </td>
                <td className="p-4">{order.email || "N/A"}</td>
                <td className="p-4">{order.orderNumber || "N/A"}</td>
                <td className="p-4">
                  <h1
                    className={`max-w-fit px-3 text-sm rounded-lg capitalize ${
                      index % 3 === 0
                        ? "text-blue-600 bg-blue-50"
                        : index % 3 === 1
                        ? "text-purple-600 bg-purple-50"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.paymentMethod || "N/A"}
                  </h1>
                </td>
                <td className="p-4">
                  <h1
                    className={`max-w-fit px-3 text-sm rounded-lg capitalize ${
                      order.status === "pending"
                        ? "text-yellow-600 bg-red-50"
                        : order.status === "processing"
                        ? "text-green-600 bg-green-50"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status || "N/A"}
                  </h1>
                </td>
                <td className="p-4 text-right font-semibold text-sm">
                  ${order.total?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between py-5 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, totalCount)} of {totalCount} results
          </span>
          <div className="flex gap-4 [&>*]:cursor-pointer">
            {/* First */}
            <button
              onClick={handleFirst}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 bg-white hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              « First
            </button>

            {/* Prev */}
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="disabled:cursor-not-allowed disabled:bg-gray-300 px-3 py-1 text-sm text-white bg-gray-800 hover:bg-gray-950 border rounded-md"
            >
              Prev
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-300 bg-gray-800 hover:bg-gray-950 border rounded-md"
            >
              Next
            </button>

            {/* Last */}
            <button
              onClick={handleLast}
              disabled={currentPage === totalPages}
              className="disabled:text-gray-300 disabled:cursor-not-allowed px-3 py-1 text-sm text-gray-600 bg-white rounded-md hover:bg-gray-100"
            >
              Last »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
