import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import CountDownDate from "./CoutDown";
import CardProductsStandard from "./CardProductsStandard";
import { fetchProductsIsSaleLimit } from "../FetchAPI/FetchAPI";
import SkeletonCard from "./SkeletonLoadingCard";
export const Today = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products sale"],
    queryFn: fetchProductsIsSaleLimit,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const getProductPath = (category) => {
    if (category === "phone") {
      return "product-details-phones";
    }
    if (category === "laptop") {
      return "product-details-laptops";
    }
  };
  const renderDateTime = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return;
    } else {
      // Render a countdown
      return (
        <div className="flex items-center gap-[20px]">
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-medium leading-[18px]">Days</span>
            <span className="lg:text-[32px] text-[20px] font-bold leading-[30px] tracking-[1.28px]">
              {days}
            </span>
          </div>
          <div className="">:</div>
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-medium leading-[18px]">
              Hours
            </span>
            <span className="lg:text-[32px] text-[20px] font-bold leading-[30px] tracking-[1.28px]">
              {hours}
            </span>
          </div>
          <div className="">:</div>
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-medium leading-[18px]">
              Minutes
            </span>
            <span className="lg:text-[32px] text-[20px] font-bold leading-[30px] tracking-[1.28px]">
              {minutes}
            </span>
          </div>
          <div className="">:</div>
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-medium leading-[18px]">
              Seconds
            </span>
            <span className="lg:text-[32px] text-[20px] font-bold leading-[30px] tracking-[1.28px]">
              {seconds}
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="pt-[140px]  pb-[60px] border-b border-[gray-500] pl-[20px] lg:px-[100px]">
      <div className="flex lg:items-end lg:justify-between pr-[20px] lg:flex-row flex-col">
        <div
          className="flex flex-col gap-[24px]"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="flex items-center gap-[16px]">
            <div className="w-[20px] h-[40px] rounded-md bg-black"></div>
            <span className="text-[16px] text-black font-semibold leading-[20px]">
              Today's
            </span>
          </div>
          <h1 className="lg:text-[36px] text-[20px] text-red-500 font-semibold lg:leading-[48px] lg:tracking-[1.44px]">
            Flash Sales
          </h1>
        </div>

        <div
          className="text-[20px] lg:text-[32px] font-medium py-[30px] lg:py-0"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="100"
        >
          <CountDownDate
            time={3 * 86400000}
            styleRender={renderDateTime}
          />
        </div>
      </div>
      <div className="lg:my-[80px] my-[50px] grid lg:grid-cols-4 gap-[20px] lg:gap-[30px] scroll-slides">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </>
        ) : (
          data.map((product, index) => {
            if (product.isSale) {
              return (
                <CardProductsStandard
                  key={product.id}
                  data={product}
                  index={index}
                  path={`${getProductPath(product.cate)}`}
                />
              );
            }
          })
        )}
      </div>
      <div
        className="flex items-center justify-center"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <Link
          className=" rounded-full flex items-center justify-center py-2.5 px-[50px] transition-all  hover:opacity-90 hover:scale-105 duration-300 bg-[#0077ed]"
          to="/sales"
        >
          <button className="text-white text-[16px] font-medium leading-[24px]">
            View All
          </button>
        </Link>
      </div>
    </div>
  );
};
