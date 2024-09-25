import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { memo, useContext, useEffect, useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Error } from "./Error";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { UserContext } from "../Context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { fetchOrdersByUser } from "../FetchAPI/FetchAPI";
import SkeletonOrder from "../components/SkekletonOrder";
const MyOrders = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", user?.userId],
    queryFn: () => fetchOrdersByUser(user),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
        <div className=" py-[80px]">
          <div className="grid grid-cols-4">
            <div className=" col-span-1 flex flex-col gap-[24px]">
              <button className="text-[16px] w-fit font-medium leading-[24px]">
                My Orders
              </button>
            </div>
            <div className="pb-[30px] px-[50px] col-span-3 ">
              <div className="flex items-center  justify-between text-[14px] leading-[21px] font-medium text-gray-400 pb-8">
                <button
                  className="flex items-center justify-center px-5 py-1 text-black border-2 border-black rounded-2xl"
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
                  className="flex items-center justify-center px-5 py-1 border-2 border-gray-400 rounded-2xl"
                  onClick={() => navigate("/orders/purchase/status=canceled")}
                >
                  Cancel
                </button>

                <button className="flex items-center justify-center px-5 py-1 border-2 border-gray-400 rounded-2xl">
                  Returns
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {!isLoading ? (
                  data ? (
                    data.length > 0 ? (
                      data
                        .sort(
                          (a, b) =>
                            new Date(
                              b.createdAt
                                .split(" ")[0]
                                .split("/")
                                .reverse()
                                .join("-") +
                                " " +
                                b.createdAt.split(" ")[1]
                            ) -
                            new Date(
                              a.createdAt
                                .split(" ")[0]
                                .split("/")
                                .reverse()
                                .join("-") +
                                " " +
                                a.createdAt.split(" ")[1]
                            )
                        )
                        .map((product) => {
                          // Thông tin chung của đơn hàng user order
                          return (
                            <div
                              className="relative p-6 border-2 border-gray-300 rounded-xl"
                              key={product.id}
                            >
                              <div className="flex items-center gap-3 text-[13px] font-medium">
                                <div
                                  className={`px-4 py-1   rounded-full flex items-center gap-2 ${
                                    product.status === "Shipping"
                                      ? "bg-[#fff2e5]"
                                      : ""
                                  } ${
                                    product.status === "Cancel"
                                      ? "bg-[#ffe8e5]"
                                      : ""
                                  } ${
                                    product.status === "Confirm"
                                      ? "bg-[#fce5ff]"
                                      : ""
                                  } ${
                                    product.status === "Pending"
                                      ? "bg-[#fce5ff]"
                                      : ""
                                  } ${
                                    product.status === "Completed"
                                      ? "bg-[#d0fbd4]"
                                      : ""
                                  }
                                                        `}
                                >
                                  <div
                                    className={`rounded-full size-[13px] ${
                                      product.status === "Shipping"
                                        ? "bg-[#e08228]"
                                        : ""
                                    } ${
                                      product.status === "Cancel"
                                        ? "bg-[#de491c]"
                                        : ""
                                    }  ${
                                      product.status === "Confirm"
                                        ? "bg-[#9a1cde]"
                                        : ""
                                    } ${
                                      product.status === "Pending"
                                        ? "bg-[#9a1cde]"
                                        : ""
                                    } ${
                                      product.status === "Completed"
                                        ? "bg-[#1cde49]"
                                        : ""
                                    }`}
                                  ></div>
                                  <span
                                    className={`text-[12px] font-semibold  ${
                                      product.status === "Shipping"
                                        ? "text-[#e08228]"
                                        : ""
                                    } ${
                                      product.status === "Cancel"
                                        ? "text-[#e04728]"
                                        : ""
                                    } ${
                                      product.status === "Confirm"
                                        ? "text-[#bb28e0]"
                                        : ""
                                    } ${
                                      product.status === "Pending"
                                        ? "text-[#bb28e0]"
                                        : ""
                                    } ${
                                      product.status === "Completed"
                                        ? "text-[#59e028]"
                                        : ""
                                    }`}
                                  >
                                    {product.status.toString().toLowerCase() ===
                                    "confirm"
                                      ? "Pending"
                                      : product.status}
                                  </span>
                                </div>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-400">
                                  {product.createdAt}
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
                                      <div className="flex items-center gap-4 pt-3">
                                        <LazyLoadImage
                                          src={product.image}
                                          alt={product.name}
                                          width={70}
                                          effect="blur"
                                          height={70}
                                          style={{
                                            objectFit: "contain",
                                          }}
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
                              <div
                                className="absolute top-[50%] right-[50px] translate-y-[-50%] size-[60px] rounded-full flex items-center justify-center hover:cursor-pointer"
                                onClick={() =>
                                  // Xử lí chuyển trang sang order details gồm id đơn hàng, tổng giá tiền đơn hàng, những sản phẩm đã đặt
                                  navigate(`/order-detail/${product.orderId}`, {
                                    state: {
                                      orders: product,
                                      total: product.total,
                                    },
                                  })
                                }
                              >
                                <ChevronRightIcon className="size-[27px]" />
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-[17px] text-center py-16 font-normal text-gray-400">
                        You have no orders
                      </div>
                    )
                  ) : (
                    <div className="text-[17px] text-center py-16 font-normal text-gray-400">
                      Have some error to load your orders
                    </div>
                  )
                ) : (
                  <div className="flex flex-col gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <SkeletonOrder key={index} />
                    ))}
                  </div>
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
export default memo(MyOrders);
