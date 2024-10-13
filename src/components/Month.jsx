import CardProductsStandard from "./CardProductsStandard";
import { useQuery } from "@tanstack/react-query";
import { fetchProductsBestSellingLimit } from "../FetchAPI/FetchAPI";
import SkeletonCard from "./SkeletonLoadingCard";
export const Month = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products best sell"],
    queryFn: fetchProductsBestSellingLimit,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className=" lg:pl-0 pl-[20px] lg:py-[100px] py-[40px]">
      <div className="flex items-end justify-between pr-[20px] lg:pr-0">
        <div className="flex flex-col gap-[24px]">
          <div
            className="flex items-center gap-[16px]"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className="w-[20px] h-[40px] rounded-md bg-black"></div>
            <span className="text-[16px] text-black font-semibold leading-[20px]">
              Best Selling
            </span>
          </div>
          <h1
            className="lg:text-[36px] text-[25px] font-semibold lg:leading-[48px] tracking-[1.44px]"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            Best Selling Products
          </h1>
        </div>
      </div>
      <div className="lg:my-[80px] my-[50px] grid lg:grid-cols-4 scroll-slides lg:gap-[30px] gap-[20px]">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </>
        ) : (
          data.map((product, index) => {
            return (
              <div key={product.id}>
                <CardProductsStandard
                  data={product}
                  index={index}
                />
              </div>
            );
          })
        )}
      </div>
      <div
        className="flex items-center justify-center mt-8"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <button className="border border-gray-300 rounded-full flex items-center justify-center py-2.5 px-[50px] transition-all duration-300 hover:opacity-90 hover:bg-black group">
          <span className="text-black text-[16px] font-medium leading-[24px] group-hover:text-white">
            View All
          </span>
        </button>
      </div>
    </div>
  );
};
