import { Pagination } from "../components/Pagination";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { useState } from "react";
import { ListProductsSales } from "../components/ListProductsSales";
import { Error } from "./Error";
import { Loading } from "../components/Loading";
import { useQuery } from "@tanstack/react-query";
import { fetchProductsIsSale } from "../FetchAPI/FetchAPI";
import CountDownDate from "../components/CoutDown";
import IconFlashSales from "../Assets/Icon/image.webp";
import { LazyLoadImage } from "react-lazy-load-image-component";
const AllProductsSales = () => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);

  const {
    data: productsSale,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products sale"],
    queryFn: fetchProductsIsSale,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const renderDateTime = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return;
    } else {
      // Render a countdown
      return (
        <div className="flex items-center gap-3">
          <span className="text-[20px] font-medium ">{days}</span>
          <div className="text-[16px]">:</div>
          <span className="text-[20px] font-medium ">{hours}</span>
          <div className="text-[16px]">:</div>
          <span className="text-[20px] font-medium ">{minutes}</span>
          <div className="text-[16px]">:</div>
          <span className="text-[20px] font-medium ">{seconds}</span>
        </div>
      );
    }
  };
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <div className="lg:px-[135px]  px-[20px]">
        <Nav />
        {!isLoading ? (
          <>
            <div className="py-[80px]">
              <div className="flex items-end justify-between border-b-[3px] border-[#db4444] mb-14">
                <div className="flex gap-2">
                  <LazyLoadImage
                    src={IconFlashSales}
                    alt="iconFlashSale"
                    effect="blur"
                    className="size-11"
                  />
                  <h3 className="lg:text-[33px] text-[#db4444] font-semibold">
                    Flash Sales
                  </h3>
                </div>
                <div className="countdown-timer lg:w-[230px]">
                  <CountDownDate
                    time={3 * 86400000}
                    styleRender={renderDateTime}
                  />
                </div>
              </div>
              <ListProductsSales products={productsSale} />
            </div>
          </>
        ) : (
          <Loading />
        )}
        <Footer />
      </div>
    </>
  );
};
export default AllProductsSales;
