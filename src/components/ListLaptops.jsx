import CardProductsStandard from "./CardProductsStandard";
import { memo } from "react";
const ListLaptops = ({ filteredProducts }) => {
  return (
    <>
      {filteredProducts.length > 0 ? (
        <div
          className={`grid lg:grid-cols-3 grid-cols-1 gap-x-[30px] gap-y-[40px]`}
        >
          {filteredProducts.map((product) => {
            return (
              <div key={product.id}>
                <CardProductsStandard
                  data={product}
                  animation={false}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-start justify-center w-full h-full py-[50px]">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[28px] font-medium lg:leading-[24px] text-center">
              Sorry we couldn't find any matches
            </span>
            <span className="text-[16px] text-gray-400 font-normal">
              Please try find with another product
            </span>
          </div>
        </div>
      )}
    </>
  );
};
export default memo(ListLaptops);
