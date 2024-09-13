import CardProductsStandard from "./CardProductsStandard";
import { useEffect } from "react";
export const ListProductsSales = ({ products }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  // Tùy sp có link khác nhau
  const getProductPath = (category) => {
    if (category === "phone") {
      return "product-details-phones";
    }
    if (category === "laptop") {
      return "product-details-laptops";
    }
  };
  return (
    <>
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-[30px]">
        {products.map((product, index) => {
          return (
            <CardProductsStandard
              path={`${getProductPath(product.cate)}`}
              data={product}
              index={index}
            />
          );
        })}
      </div>
    </>
  );
};
