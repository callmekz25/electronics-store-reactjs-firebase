import CardProductsStandard from "./CardProductsStandard";
import { fetchProductsIsSale } from "../FetchAPI/FetchAPI";
import { useQuery } from "@tanstack/react-query";
import { Error } from "../Pages/Error";
import SkeletonCard from "./SkeletonLoadingCard";
const ExploreProducts = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all products"],
    queryFn: fetchProductsIsSale,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return <Error />;
  }
  return (
    <div className="pl-[20px] lg:px-0 lg:py-[100px] py-[40px]">
      <div
        className="flex flex-col gap-[24px]"
        data-aos="fade-up"
      >
        <div className="flex items-center gap-[16px]">
          <div className="w-[20px] h-[40px] rounded-md bg-[#0077ed]"></div>
          <span className="text-[16px] text-[#0077ed] font-semibold leading-[20px]">
            Our Products
          </span>
        </div>
        <h1 className="lg:text-[36px] text-[25px] font-semibold leading-[48px] tracking-[1.44px]">
          Explore Our Products
        </h1>
      </div>
      <div className="my-[50px] lg:my-[80px] grid lg:grid-cols-4 scroll-slides lg:gap-[30px] gap-[20px]">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </>
        ) : (
          products.map((product, index) => {
            return (
              <div key={product.id}>
                <CardProductsStandard
                  data={product}
                  index={index}
                  key={product.id}
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
        <button className="bg-[#0077ed] rounded-full flex items-center justify-center py-3 px-[30px] hover:opacity-90">
          <span className="text-white text-[16px] font-medium leading-[24px]">
            View More
          </span>
        </button>
      </div>
    </div>
  );
};
export default ExploreProducts;
