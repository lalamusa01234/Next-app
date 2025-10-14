import React from "react";
import { UseFormRegister, FieldErrors, UseFormHandleSubmit, UseFormReset } from "react-hook-form";

interface FormValues {
  category: string;
  image: FileList;
}

interface EditCatProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  register: UseFormRegister<FormValues>;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  errors: FieldErrors<FormValues>;
  reset: UseFormReset<FormValues>;
  category: { category: string } | null;
}

const EditCat: React.FC<EditCatProps> = ({
  show,
  onClose,
  onSubmit,
  register,
  handleSubmit,
  errors,
  reset,
  category,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[100]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-2xl w-[28rem] overflow-hidden"
      >
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between">
          <h2 className="text-lg font-semibold">
            {category ? "Edit Category" : "Add Category"}
          </h2>
        </div>

        <div className="p-6">
          <input
            type="text"
            placeholder="Category Name"
            {...register("category", { required: "Category name is required" })}
            className="w-full border p-3 rounded-lg mb-2"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </div>

        <div className="px-6 pb-6">
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              reset({ category: "", image: undefined as any });
              onClose();
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCat;
