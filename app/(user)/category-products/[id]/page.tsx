import React from "react";
import Shop from "../../_components/shop";

interface PageProps {
  params: {
    id: string;
  };
}

const CategoryProductsPage = ({ params }: PageProps) => {
  const { id } = params;

  return (
    <div className="mx-10 xl:mx-15 2xl:mx-46">
      <Shop categoryId={id} limit={0} />
    </div>
  );
};

export default CategoryProductsPage;
