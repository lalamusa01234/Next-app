import React from "react";
import PageDetail from "../_components/page-detail";

type ProductDetailProps = {
  params: {
    id: string
  }
}

// Server Component
const ProductDetail = async ({ params }: ProductDetailProps) => {
  // You can pass params as props if needed
  const { id } = await params
  return <PageDetail productId={id} />;
};

export default ProductDetail;
