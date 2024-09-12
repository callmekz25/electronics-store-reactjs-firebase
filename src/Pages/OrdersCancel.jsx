import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useContext, useEffect, useState } from "react";
import { getDocs, collection, where, query } from "firebase/firestore";
import { db } from "../firebase";
import { Loading } from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Error } from "./Error";
import { UserContext } from "../Context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { fetchOrdersCancel } from "../FetchAPI/FetchAPI";
const OrdersCancel = () => {
  const navigate = useNavigate();

  const { user, loading } = useContext(UserContext);
  // Hàm lấy dữ liệu từ database những order của user đã cancel
  const {
    data: ordersCancel,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders cancel", user?.userId],
    queryFn: () => fetchOrdersCancel(user),
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isError) {
    return <Error />;
  }
  return (
    <div className="lg:px-[135px] px-[20px]">
      <Nav />

      <>
        <>
          <div className="flex items-center gap-2 py-[80px]">
            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
              Profile
            </span>
            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
              /
            </span>
            <span className="text-black text-[14px] font-normal  leading-[21px]">
              My Orders
            </span>
          </div>
        </>
        <div className=" py-[80px]">
          <div className="grid grid-cols-4">
            <div className=" col-span-1 flex flex-col gap-[24px]">
              <button className="text-[16px] w-fit font-medium leading-[24px]">
                My Orders
              </button>
            </div>
            <div className="pb-[30px] px-[50px] col-span-3 ">
              <div className="flex items-center justify-between text-[14px] leading-[21px] font-medium text-gray-400 pb-8">
                <button
                  className="flex items-center justify-center px-5 py-1 border-2 border-gray-400 rounded-2xl"
                  onClick={() => navigate("/orders/purchase/status=all")}
                >
                  All
                </button>
                <button
                  className="flex items-center justify-center px-5 py-1 border-2 border-gray-400 rounded-2xl"
                  onClick={() => navigate("/orders/purchase/status=shipping")}
                >
                  Shipping
                </button>

                <button className="flex items-center justify-center px-5 py-1 border-2 border-gray-400 rounded-2xl">
                  Completed
                </button>

                <button
                  className="flex items-center justify-center px-5 py-1 text-black border-2 border-black rounded-2xl"
                  onClick={() => navigate("/orders/purchase/status=canceled")}
                >
                  Cancel
                </button>

                <button className="flex items-center justify-center px-5 py-1 border-2 border-gray-400 rounded-2xl">
                  Returns
                </button>
              </div>
              <div className="flex flex-col gap-8">
                {!isLoading ? (
                  ordersCancel.length > 0 ? (
                    ordersCancel.map((product) => {
                      // Thông tin chung của đơn hàng user order
                      return (
                        <div className="relative p-6 border-2 border-gray-300 rounded-xl">
                          <div className="flex items-center gap-3 text-[13px] font-medium">
                            <div className="px-4 py-1  bg-[#ffe9e5] rounded-full flex items-center gap-2">
                              <div className="bg-[#e03728] rounded-full size-[13px]"></div>
                              <span className="text-[12px] font-semibold text-[#e03e28]">
                                {product.status}
                              </span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-400">
                              {product.cancelAt}
                            </span>
                          </div>
                          <div className="pt-4 flex items-center gap-2 text-[15px] font-semibold px-1 text-[#801415]">
                            <span>Order ID:</span>
                            <span>{product.orderId}</span>
                          </div>
                          {product.products.map(
                            // Đây là những sản phẩm trong chi tiết đơn hàng user đặt
                            (product) => {
                              return (
                                <>
                                  <div className="flex items-center gap-4 pt-5 ">
                                    <LazyLoadImage
                                      effect="blur"
                                      src={product.image}
                                      alt=""
                                      className="size-[70px] object-contain"
                                    />
                                    <div className="flex flex-col justify-between">
                                      <span className="text-[18px] leading-[24px] font-medium">
                                        {product.name}
                                      </span>
                                      <div className="flex items-center gap-2 text-[14px]">
                                        <span>Type:</span>
                                        <span className="text-[15px] leading-[24px]font-normal">
                                          {product.color}
                                        </span>
                                        <span className="text-[15px] leading-[24px]font-normal">
                                          x{product.quantity}
                                        </span>
                                      </div>
                                      <span className="font-semibold">
                                        ${product.price}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-[17px] text-center py-16 font-normal text-gray-400">
                      You have no orders canceled
                    </div>
                  )
                ) : (
                  <Loading css={"py-[52.5px]"} />
                )}
              </div>
            </div>
          </div>
        </div>
      </>

      <Footer />
    </div>
  );
};
export default OrdersCancel;
