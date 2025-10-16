"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addData, deleteData, decreaseData, deleteCart } from "../../../features/itemSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

// Types
interface SelectedOption {
  name: string;
  value: string;
}

interface CartItem {
  _id: string;
  name: string;
  image?: string[] | string;
  finalPrice: number;
  quantity: number;
  variation?: string;
  selectedOptions?: SelectedOption[];
}

interface ItemState {
  list: CartItem[];
}

const Cart: React.FC = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const dispatch = useDispatch();
  const itemData = useSelector((state: { items: ItemState }) => state.items);

  const itemQuantity = itemData.list.reduce((acc, item) => acc + item.quantity, 0);
  const itemTotal = itemData.list.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);
  const [mounted, setMounted] = useState(false);

  const renderAttributes = (selectedOptions?: SelectedOption[]) => {
    if (!selectedOptions || selectedOptions.length === 0) return null;
    return selectedOptions.map((opt) => `${opt.name}: ${opt.value}`).join(", ");
  };

   useEffect(() => {
    setMounted(true); // now we are client-side
  }, []);

  if (!mounted) return null; // avoid SSR mismatch

  return (
    <div className="p-10">
      <div className="flex justify-between">
        <h2 className="font-semibold text-3xl">
          <FontAwesomeIcon icon={faCartShopping} /> Cart
        </h2>
        <p
          onClick={() => dispatch(deleteCart())}
          className="hover:text-red-500 text-gray-400 underline cursor-pointer"
        >
          Empty cart
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 w-full gap-4 mt-5">
        {itemData.list.length === 0 ? (
          <div className={"md:col-span-3"}>
            <p className={"p-2 bg-gray-100 mb-5 text-center"}>No items in cart</p>
          </div>
        ) : (
          <div className="md:col-span-3 space-y-4">
            {itemData.list.map((item, ind) => (
              <div
                key={item._id + ind}
                className={ind % 2 === 0 ? "bg-gray-50 py-5" : "py-5 bg-orange-50"}
              >
                <div className="flex justify-between mx-7">
                  {/* Image */}
                  <div className="relative h-20 w-20">
                    <img
                      src={`${API_BASE_URL}${
                        Array.isArray(item.image) ? item.image[0] : item.image || "/placeholder.jpg"
                      }`}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 px-4">
                    <p className="font-semibold">{item.name}</p>

                    {item.variation && item.variation !== "Standard" && (
                      <p className="text-sm text-gray-500">Variation: {item.variation}</p>
                    )}

                    {/* Attributes */}
                    {renderAttributes(item.selectedOptions) && (
                      <p className="text-sm text-gray-500">
                        {renderAttributes(item.selectedOptions)}
                      </p>
                    )}

                    {/* Quantity controls */}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          dispatch(
                            decreaseData({
                              _id: item._id,
                              selectedOptions: item.selectedOptions || [],
                            })
                          )
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="self-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            addData({
                              ...item,
                              selectedOptions: item.selectedOptions || [],
                            })
                          )
                        }
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price & Delete */}
                  <div className="flex flex-col items-center">
                    <button
                      className="text-red-500 mb-2"
                      onClick={() =>
                        dispatch(
                          deleteData({
                            _id: item._id,
                            selectedOptions: item.selectedOptions || [],
                          })
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                    <p>${(item.finalPrice * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="w-full bg-gray-50 p-5">
          {itemData.list.length === 0 ? (
            <p className="text-center font-semibold">Empty!</p>
          ) : (
            <>
              <div className="space-y-4">
                {itemData.list.map((item, id) => (
                  <div key={id} className="flex justify-between items-center">
                    <p>{item.name}</p>
                    <p>${(item.finalPrice * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
                <p className="text-gray-700">Subtotal</p>
                <p className="text-right text-gray-700">${itemTotal.toFixed(2)}</p>

                <p className="text-gray-700">Tax</p>
                <p className="text-right text-gray-700">${itemQuantity * 3}</p>

                <p className="text-2xl font-semibold pt-3">Total</p>
                <p className="text-right font-semibold text-2xl pt-3">
                  ${(itemTotal + itemQuantity * 3).toFixed(2)}
                </p>

                <Link className="col-span-2" href="/checkout">
                  <button className="w-full block py-2 my-3 bg-black text-white text-lg rounded-[20px]">
                    CheckOut
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
