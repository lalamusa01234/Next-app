"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Product, Category, Variation } from "../types/product";

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: Product;
}

interface FormData {
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
  discountValue?: number;
}

const ProductForm = ({ mode, initialData }: ProductFormProps) => {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const productFromInitial = initialData || {} as Product;

  const [categories, setCategories] = useState<Category[]>([]);
  const [hasDiscount, setHasDiscount] = useState<boolean>(productFromInitial.hasDiscount || false);
  const [discountType, setDiscountType] = useState<string>(productFromInitial.discountType || "");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [showVariations, setShowVariations] = useState<boolean>((productFromInitial.variations?.length || 0) > 0);
  const [variations, setVariations] = useState<Variation[]>(
    productFromInitial.variations?.length
      ? productFromInitial.variations
      : [{ name: "", price: 0, quantity: 0, hasDiscount: false, discountType: "", discountValue: 0 }]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: productFromInitial && Object.keys(productFromInitial).length > 0
      ? {
          name: productFromInitial.name || "",
          price: productFromInitial.price || 0,
          quantity: productFromInitial.quantity || 0,
          category: typeof productFromInitial.category === "object" ? productFromInitial.category._id : productFromInitial.category || "",
          description: productFromInitial.description || "",
          discountValue: productFromInitial.discountValue || 0,
        }
      : {
          name: "",
          price: 0,
          quantity: 0,
          category: "",
          description: "",
          discountValue: 0,
        },
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const PRODUCT_API = `${API_BASE_URL}/api/products`;
  const CATEGORY_API = `${API_BASE_URL}/api/categories`;

  useEffect(() => {
    axios
      .get<Category[]>(CATEGORY_API)
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to fetch categories"));
  }, []);

  useEffect(() => {
    if (isEditMode && productFromInitial && Object.keys(productFromInitial).length > 0 && categories.length > 0) {
      reset({
        name: productFromInitial.name || "",
        description: productFromInitial.description || "",
        category: typeof productFromInitial.category === "object" ? productFromInitial.category._id : productFromInitial.category || "",
        price: productFromInitial.price || 0,
        quantity: productFromInitial.quantity || 0,
        discountValue: productFromInitial.discountValue || 0,
      });

      setHasDiscount(productFromInitial.hasDiscount || false);
      setDiscountType(productFromInitial.discountType || "");
      setVariations(
        productFromInitial.variations?.length
          ? productFromInitial.variations
          : [{ name: "", price: 0, quantity: 0, hasDiscount: false, discountType: "", discountValue: 0 }]
      );
      setShowVariations((productFromInitial.variations?.length || 0) > 0);
      setSelectedImages([]);
    }
  }, [isEditMode, productFromInitial, categories, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => setSelectedImages((prev) => prev.filter((_, i) => i !== index));

  const handleVariationChange = (index: number, field: keyof Variation, value: string | boolean | number) => {
    const copy = [...variations];
    copy[index][field] = value as never; // Type assertion for flexibility
    setVariations(copy);
  };

  const addVariation = () => setVariations([...variations, { name: "", price: 0, quantity: 0, hasDiscount: false, discountType: "", discountValue: 0 }]);

  const removeVariation = (idx: number) => setVariations(variations.filter((_, i) => i !== idx));

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("description", data.description);

      if (selectedImages.length > 0) {
        selectedImages.forEach((f) => formData.append("image", f));
      }

      if (showVariations && variations.length > 0) {
        const cleanVariations = variations.map((v) => {
          let finalPrice = Number(v.price);

          if (v.hasDiscount && v.discountType && v.discountValue) {
            if (v.discountType === "percentage") {
              finalPrice = v.price - (v.price * v.discountValue) / 100;
            } else if (v.discountType === "flat") {
              finalPrice = v.price - v.discountValue;
            }
          }

          return {
            name: v.name,
            price: Number(v.price),
            quantity: Number(v.quantity),
            hasDiscount: v.hasDiscount || false,
            discountType: v.discountType || "",
            discountValue: v.discountValue || 0,
            finalPrice: Math.max(finalPrice, 0),
          };
        });

        formData.append("price", cleanVariations[0].price.toString());
        formData.append("quantity", data.quantity.toString());
        formData.append("hasDiscount", cleanVariations[0].hasDiscount.toString());
        formData.append("discountType", cleanVariations[0].discountType);
        formData.append("discountValue", cleanVariations[0].discountValue.toString());
        formData.append("finalPrice", cleanVariations[0].finalPrice.toString());

        formData.append("variations", JSON.stringify(cleanVariations));
      } else {
        formData.append("price", data.price.toString());
        formData.append("quantity", data.quantity.toString());

        let finalPrice = Number(data.price);

        if (hasDiscount && discountType && data.discountValue) {
          formData.append("hasDiscount", "true");
          formData.append("discountType", discountType);
          formData.append("discountValue", data.discountValue.toString());

          if (discountType === "percentage") {
            finalPrice = data.price - (data.price * (data.discountValue || 0)) / 100;
          } else if (discountType === "flat") {
            finalPrice = data.price - (data.discountValue || 0);
          }
        } else {
          formData.append("hasDiscount", "false");
        }

        formData.append("finalPrice", Math.max(finalPrice, 0).toString());
      }

      if (isEditMode) {
        await axios.put(`${PRODUCT_API}/${productFromInitial._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated!");
      } else {
        await axios.post(PRODUCT_API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added!");
      }

      router.push("/admin/products");
    } catch (err: any) {
      console.error("Error saving product:", err);
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  return (
    <div className="mx-5">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl w-full my-8 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block font-medium">Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" />
            {selectedImages.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedImages.map((file, i) => (
                  <div key={i} className="relative group border rounded-lg overflow-hidden">
                    <img src={URL.createObjectURL(file)} alt={`preview-${i}`} className="w-full h-28 object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 hover:opacity-100">✕</button>
                  </div>
                ))}
              </div>
            )}

            {isEditMode && productFromInitial.image?.length > 0 && (
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                {productFromInitial.image.map((img, idx) => (
                  <img key={idx} src={`${API_BASE_URL}${img}`} alt={`old-${idx}`} className="w-full h-28 object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium">Category</label>
            <select {...register("category", { required: "Category is required" })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3">
              <option value="">Select Category</option>
              {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.category}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block font-medium">Name</label>
            <input type="text" {...register("name", { required: "Name is required" })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium">Price</label>
              <input type="number" {...register("price", { required: "Price is required" })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block font-medium">Quantity</label>
              <input type="number" {...register("quantity", { required: "Quantity is required" })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3" />
              {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
            </div>
          </div>

          <div>
            {!showVariations ? (
              <button
                type="button"
                onClick={() => setShowVariations(true)}
                className="px-4 py-2 bg-gray-800 text-white rounded-full mb-4"
              >
                Add Variations
              </button>
            ) : (
              <div className="space-y-6">
                {variations.map((v, idx) => (
                  <div key={idx} className="rounded-lg border p-4 bg-gray-50 space-y-3">
                    <h4 className="font-medium">Variation {idx + 1}</h4>

                    <input
                      type="text"
                      placeholder="Variation Name"
                      value={v.name}
                      onChange={(e) => handleVariationChange(idx, "name", e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-3"
                    />

                    <div className="flex gap-4">
                      <input
                        type="number"
                        placeholder="Price"
                        value={v.price}
                        onChange={(e) => handleVariationChange(idx, "price", Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded-lg p-3"
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={v.quantity}
                        onChange={(e) => handleVariationChange(idx, "quantity", Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded-lg p-3"
                      />
                    </div>

                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={v.hasDiscount || false}
                        onChange={(e) => handleVariationChange(idx, "hasDiscount", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900">Apply Discount?</span>
                    </label>

                    {v.hasDiscount && (
                      <div className="mt-3 space-y-3">
                        <div className="flex gap-4">
                          <label>
                            <input
                              type="radio"
                              value="percentage"
                              checked={v.discountType === "percentage"}
                              onChange={(e) => handleVariationChange(idx, "discountType", e.target.value)}
                            />{" "}
                            % Percentage
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="flat"
                              checked={v.discountType === "flat"}
                              onChange={(e) => handleVariationChange(idx, "discountType", e.target.value)}
                            />{" "}
                            Flat Price
                          </label>
                        </div>

                        {v.discountType && (
                          <input
                            type="number"
                            placeholder={v.discountType === "percentage" ? "Discount (%)" : "Discount Amount"}
                            value={v.discountValue || ""}
                            onChange={(e) => handleVariationChange(idx, "discountValue", Number(e.target.value))}
                            className="w-full p-2 border rounded-lg"
                          />
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeVariation(idx)}
                      className="p-3 bg-red-600 text-white rounded-full mt-3 block"
                    >
                      Remove Variation
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addVariation}
                  className="px-4 py-2 bg-gray-800 text-white rounded-full mt-4"
                >
                  Add Another Variation
                </button>
              </div>
            )}
          </div>

          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={hasDiscount} onChange={(e) => { setHasDiscount(e.target.checked); if (!e.target.checked) setDiscountType(""); }} className="sr-only peer" />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">Apply Discount?</span>
          </label>

          {hasDiscount && (
            <div className="mt-3 space-y-3">
              <div className="flex gap-4">
                <label><input type="radio" value="percentage" checked={discountType === "percentage"} onChange={(e) => setDiscountType(e.target.value)} /> % Percentage</label>
                <label><input type="radio" value="flat" checked={discountType === "flat"} onChange={(e) => setDiscountType(e.target.value)} /> Flat Price</label>
              </div>
              {discountType && (
                <input type="number" {...register("discountValue", { required: true, min: 1 })} placeholder={discountType === "percentage" ? "Discount (%)" : "Discount Amount"} className="w-full p-2 border rounded-lg" />
              )}
              {errors.discountValue && <p className="text-red-500 text-sm">Discount value is required and must be at least 1</p>}
            </div>
          )}

          <div>
            <label className="block font-medium">Description</label>
            <textarea rows={6} {...register("description", { required: "Description is required" })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 resize-none" />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button type="button" onClick={() => router.back()} className="px-5 py-2 bg-gray-200 cursor-pointer text-gray-800 rounded-lg">Cancel</button>
          <button type="submit" className="px-5 py-2 bg-gray-800 text-white rounded-lg cursor-pointer">{isEditMode ? "Update" : "Save"}</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;