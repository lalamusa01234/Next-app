"use client"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../_components/ProductForm";
import { Product } from "../../types/product";

const EditProductPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);

  const API = "http://localhost:3000/api/products";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get<{ product: Product }>(`${API}/${id}`);
        setProduct(res.data.product || res.data as unknown as Product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-full mx-auto">
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
};

export default EditProductPage;