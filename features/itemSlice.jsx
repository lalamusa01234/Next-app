"use client";
import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const getInitialCart = () => {
  try {
    
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage", error);
    return [];
  }
};

// Utility: compare selectedOptions arrays
const areOptionsEqual = (a = [], b = []) => {
  if (a.length !== b.length) return false;
  return a.every((opt, i) => opt.name === b[i]?.name && opt.value === b[i]?.value);
};

export const itemSlice = createSlice({
  name: "item",
  initialState: {
    list: getInitialCart(),
  },
  reducers: {
    addData: (state, action) => {
      const item = action.payload;

      // Check if exact same product with exact same options exists
      const existingItem = state.list.find(
        (i) => i._id === item._id && areOptionsEqual(i.selectedOptions, item.selectedOptions)
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.list.push({ ...item, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.list));
    },

    decreaseData: (state, action) => {
      const item = state.list.find(
        (i) => i._id === action.payload._id && areOptionsEqual(i.selectedOptions, action.payload.selectedOptions)
      );

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.list = state.list.filter(
          (i) => !(i._id === action.payload._id && areOptionsEqual(i.selectedOptions, action.payload.selectedOptions))
        );
      }

      localStorage.setItem("cart", JSON.stringify(state.list));
    },

    deleteData: (state, action) => {
      state.list = state.list.filter(
        (i) => !(i._id === action.payload._id && areOptionsEqual(i.selectedOptions, action.payload.selectedOptions))
      );
      localStorage.setItem("cart", JSON.stringify(state.list));
    },

    bulkUpdateData: (state, action) => {
      const { _id, selectedOptions, quantity } = action.payload;
      const item = state.list.find(
        (i) => i._id === _id && areOptionsEqual(i.selectedOptions, selectedOptions)
      );

      if (item) {
        item.quantity += quantity;
        if (item.quantity <= 0) {
          state.list = state.list.filter(
            (i) => !(i._id === _id && areOptionsEqual(i.selectedOptions, selectedOptions))
          );
        }
      } else if (quantity > 0) {
        state.list.push({ ...action.payload, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(state.list));
    },

    deleteCart: (state) => {
      state.list = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addData, decreaseData, deleteData, bulkUpdateData, deleteCart } = itemSlice.actions;
export default itemSlice.reducer;
