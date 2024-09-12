import { StarIcon as StarIconFilled } from "@heroicons/react/24/solid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviewsByProductId } from "../FetchAPI/FetchAPI";
const CardProductsStandard = ({ data, index, animation = true }) => {
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["reviews", data?.id],
    queryFn: () => fetchReviewsByProductId(data),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  // Hàm tính tổng số rate của từng user cho sản phẩm
  const totalRate = useMemo(() => {
    if (reviewsData) {
      const total = reviewsData.reduce((result, reviewsData) => {
        return result + reviewsData.rate;
      }, 0);
      return total;
    }
  }, [reviewsData]);
  // Tổng số rate trung bình của sản phẩm
  const totalAvgRate = useMemo(() => {
    if (reviewsData) {
      return totalRate / reviewsData.length;
    }
  }, [reviewsData]);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <StarIconFilled
            key={i}
            className="w-4 h-4 text-yellow-500"
          />
        );
      } else {
        stars.push(
          <StarIconFilled
            key={i}
            className="w-4 h-4 text-gray-300"
          />
        );
      }
    }
    return stars;
  };
  return (
    <Link to={`/dp/${data.name}/${data.id}`}>
      <div
        key={data.id}
        data-aos={`${animation ? "fade-up" : ""}`}
        data-aos-duration="1000"
        data-aos-delay={`${index * 100}`}
      >
        <div className="flex flex-col gap-[16px] bg-[#ffffff] rounded-xl card-shadow snap-start ">
          <div className=" flex items-center justify-center p-5 pb-0 lg:p-6 lg:pb-0 relative  hover:cursor-pointer rounded-lg overflow-hidden ">
            <div className="image-product">
              <LazyLoadImage
                src={data.img}
                alt="ImageProduct"
                effect="blur"
                sizes="(max-width: 600px) 200px, 400px"
                className="lg:size-[230px] size-[200px] object-contain lg:pt-[41px] pt-[50px] "
              />
            </div>
            {data.sales ? (
              <div className="bg-[#DB4444] flex items-center justify-center rounded py-[4px] px-[12px] absolute top-[12px] left-[12px]">
                <span className="lg:text-[12px] text-[16px] text-white font-normal leading-[18px]">
                  {data.sales}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col gap-2 px-6 lg:px-6 pb-4 lg:pt-[50px] pt-4">
            <span className="text-[22px] lg:text-[19px] font-semibold leading-[24px] min-h-[75px]">
              {data.name}
            </span>
            <div className="flex items-center gap-3 text-[19px] lg:text-[16px] font-medium leading-[24px]">
              <span className="">{`$${data.newPrice}`}</span>
              <span
                className={`line-through lg:text-[14px] text-[16px] text-black opacity-50  ${
                  data.oldPrice ? "" : "hidden"
                }`}
              >
                {`$${data.oldPrice}`}
              </span>
            </div>
            <div className={`flex items-center gap-2 `}>
              <div className={`flex items-center gap-1  `}>
                {renderStars(totalAvgRate)}
              </div>
              <span
                className={`text-[14px]  font-semibold leading-[21px] opacity-50 
                            }`}
              >
                ({isLoading ? "0" : reviewsData.length})
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default memo(CardProductsStandard);
