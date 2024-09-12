import { Pagination } from "../components/Pagination";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { useState } from "react";
import { ListProductsSales } from "../components/ListProductsSales";
import { Error } from "./Error";
import { Loading } from "../components/Loading";
import { useQuery } from "@tanstack/react-query";
import { fetchProductsIsSale } from "../FetchAPI/FetchAPI";

const AllProductsSales = () => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);

  const {
    data: productsSale,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all products sale"],
    queryFn: fetchProductsIsSale,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <div className="lg:px-[135px]  px-[20px]">
        <Nav />
        {!isLoading ? (
          <>
            <div className=" py-[80px]">
              <ListProductsSales products={productsSale} />
            </div>
            <Footer />
          </>
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
};
export default AllProductsSales;
