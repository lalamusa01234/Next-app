"use client";
import { createSlice } from "@reduxjs/toolkit";
import { getFromStorage, setToStorage } from "@/lib/storage";

// ✅ FIXED: Empty initial state - load in useEffect
export const itemSlice = createSlice({
  name: "item",
  initialState: {
    list: [], // ✅ Empty on server
  },
  reducers: {
    addData: (state, action) => {
      const item = action.payload;
      const existingItem = state.list.find(
        (i) => i._id === item._id && areOptionsEqual(i.selectedOptions, item.selectedOptions)
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.list.push({ ...item, quantity: 1 });
      }

      setToStorage("cart", state.list); // ✅ Safe storage
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

      setToStorage("cart", state.list);
    },

    deleteData: (state, action) => {
      state.list = state.list.filter(
        (i) => !(i._id === action.payload._id && areOptionsEqual(i.selectedOptions, action.payload.selectedOptions))
      );
      setToStorage("cart", state.list);
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

      setToStorage("cart", state.list);
    },

    deleteCart: (state) => {
      state.list = [];
      setToStorage("cart", []); // ✅ Safe clear
    },

    // ✅ NEW: Load cart from storage
    loadCart: (state) => {
      const cart = getFromStorage("cart", []);
      state.list = cart;
    },
  },
});

const areOptionsEqual = (a = [], b = []) => {
  if (a.length !== b.length) return false;
  return a.every((opt, i) => opt.name === b[i]?.name && opt.value === b[i]?.value);
};

export const { addData, decreaseData, deleteData, bulkUpdateData, deleteCart, loadCart } = itemSlice.actions;
export default itemSlice.reducer;