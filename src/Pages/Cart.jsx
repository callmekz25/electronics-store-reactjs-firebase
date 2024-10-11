import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Error } from "./Error";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import SkeletonCart from "../components/SkeletonCart";
import useMobile from "../Hooks/useMobile";
import { CartContext } from "../Context/CartContext";
import { Waypoint } from "react-waypoint";
const Cart = () => {
  // Sử dụng context api để xử lí
  const {
    removeToCart,
    updateMinus,
    updatePlus,
    cartItems,
    isLoading,
    isError,
  } = useContext(CartContext);
  // State để check scroll ẩn hiện thanh thanh toán khi sản phầm trong giỏ hàng quá nhìu
  const [isScrollLast, setIsScrollLast] = useState(false);
  const [isScrollFooter, setIsScrollFooter] = useState(false);
  // State lấy những products user checked
  const [productChecked, setProductChecked] = useState([]);
  // Popup cần chọn sản phẩm để buy
  const [canBuy, setCanBuy] = useState(false);

  const isMobile = useMobile();
  const navigate = useNavigate();

  // Hàm lấy ra những sản phẩm người dùng selected
  const handleSelectedProducts = (product) => {
    setProductChecked((prev) =>
      prev.includes(product)
        ? prev.filter((a) => a.id !== product.id)
        : [...prev, product]
    );
  };
  // Tính tổng số tiền nhân với số lượng mà user selected những sản phẩm
  const totalPriceProductsSelected = useMemo(() => {
    const result = productChecked.reduce((result, product) => {
      return result + product.price * product.quantity;
    }, 0);
    return result;
  }, [productChecked]);

  // Hàm xử lí user đã chọn những sản phẩm và bấm check out
  const handleCheckOut = () => {
    if (productChecked.length === 0) {
      setCanBuy(true);
    } else {
      const ids = productChecked.map((product) => product.id).join(",");
      setCanBuy(false);
      navigate(`/checkout/state=/${ids}`, {
        state: {
          products: productChecked,
          total: totalPriceProductsSelected,
        },
      });
    }
  };
  // Ẩn thanh scroll
  useEffect(() => {
    if (canBuy) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [canBuy]);
  console.log(cartItems);

  if (isError) {
    return <Error />;
  }
  return (
    <div className="lg:px-[135px] bg-[#ffff]">
      <Nav />
      {isLoading ? (
        <SkeletonCart />
      ) : (
        <>
          {canBuy && (
            <div className="overlay">
              <div className="bg-white rounded p-5 flex flex-col lg:h-[250px] lg:w-[450px] justify-between">
                <span className="lg:text-[17px] text-black font-normal mt-5">
                  You haven't selected any products yet.
                </span>
                <button
                  className="lg:text-[16px] bg-[#db4444] text-white rounded w-full  py-2 px-14  ml-auto"
                  onClick={() => setCanBuy(false)}
                >
                  OK
                </button>
              </div>
            </div>
          )}
          <div className="px-[20px]">
            <div className="flex items-center gap-2 py-[80px]">
              <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                Home
              </span>
              <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                /
              </span>
              <span className="text-black text-[14px] font-normal  leading-[21px]">
                Cart
              </span>
            </div>
          </div>
          <div className=" text-[14 px] font-normal leading-[24px] pb-[50px] px-[20px] lg:px-0  relative">
            <div className="lg:flex hidden items-center justify-between px-[40px] py-[24px]  font-medium gap- bg-white ">
              <div className="flex items-center justify-between gap-4 w-[69%] ">
                <span className="">Products</span>
              </div>
              <div className="lg:flex lg:w-full lg:justify-between lg:items-center">
                <span className="w-[25%]">Types</span>
                <span className="w-[25%]">Price</span>
                <span className="w-[25%]">Quantity</span>
                <span className="w-[25%]">Subtotal</span>
                <span className="w-[25%]">Actions</span>
              </div>
            </div>
            {!cartItems ? (
              <div className="flex items-center justify-center py-[100px]">
                <span className="text-[20px] font-normal leading-[24px] text-[#999999]">
                  Your cart is empty
                </span>
              </div>
            ) : (
              cartItems.map((product) => {
                return (
                  <div
                    className="lg:flex lg:items-center  lg:px-[20px] lg:py-7 p-3   grid grid-cols-3  bg-white  text-[15px] border-t border-gray-200"
                    key={product.id}
                  >
                    <div className="lg:w-[69%] flex items-center gap-5">
                      <div className="flex items-center gap-3 lg:justify-between ">
                        <input
                          type="checkbox"
                          name="chechbox cart"
                          id=""
                          className="lg:size-4 size-5 hover:cursor-pointer"
                          onChange={() => handleSelectedProducts(product)}
                        />
                        <Link
                          to={`/dp/${product.name}/${product.id}`}
                          className="flex items-center gap-4"
                        >
                          <div className="flex items-center justify-center lg:px-4 p-2 bg-gray-100 lg:py-3 rounded-lg mr-3">
                            <LazyLoadImage
                              src={product.img}
                              className="lg:size-14 size-16 object-contain"
                              effect="blur"
                            />
                          </div>
                        </Link>
                      </div>
                      <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap lg:block hidden ">
                        {product.name}
                      </span>
                    </div>
                    <Link
                      to={isMobile ? `/dp/${product.name}/${product.id}` : ""}
                      className=" col-span-2 lg:flex lg:w-full  lg:items-center flex flex-col lg:flex-row hover:cursor-default "
                    >
                      <span className="font-medium overflow-hidden text-ellipsis whitespace-nowrap lg:hidden ">
                        {product.name}
                      </span>
                      <span className=" text-gray-500 w-[25%] break-words text-[13px]">
                        None
                      </span>
                      {/* Mobile */}
                      <div className="flex items-center justify-between lg:gap-14 lg:mt-0 mt-4 lg:hidden">
                        <span className="text-red-500 lg:text-black lg:font-normal  font-medium">{`$${product.newPrice}`}</span>
                        <div className="">
                          <div className="w-fit flex items-center text-gray-500 border-2 border-gray-200 rounded-s rounded-e lg:px-2 px-1">
                            <div
                              className="flex items-center justify-center hover:cursor-pointer "
                              onClick={(e) => {
                                if (product.quantity > 1) {
                                  updateMinus(product, e);
                                } else {
                                  removeToCart(product);
                                }
                              }}
                            >
                              <MinusIcon className="size-[20px]" />
                            </div>
                            <div className="flex items-center justify-center w-[30px]  font-medium leading-[28px]">
                              {product.quantity}
                            </div>
                            <div
                              className="flex items-center justify-center hover:cursor-pointer ]"
                              onClick={(e) => {
                                updatePlus(product, e);
                              }}
                            >
                              <PlusIcon className="size-[20px]" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className="text-red-500 lg:text-black lg:font-normal  font-medium hidden lg:block w-[25%]">{`$${product.newPrice}`}</span>
                      <div className="lg:block hidden w-[25%]">
                        <div className="w-fit flex items-center text-gray-500 border-2 border-gray-200 rounded-s rounded-e lg:px-2 px-1 ">
                          <div
                            className="flex items-center justify-center hover:cursor-pointer "
                            onClick={(e) => {
                              if (product.quantity > 1) {
                                updateMinus(product, e);
                              } else {
                                removeToCart(product);
                              }
                            }}
                          >
                            <MinusIcon className="size-[20px]" />
                          </div>
                          <div className="flex items-center justify-center w-[30px]  font-medium leading-[28px]">
                            {product.quantity}
                          </div>
                          <div
                            className="flex items-center justify-center hover:cursor-pointer ]"
                            onClick={(e) => {
                              updatePlus(product, e);
                            }}
                          >
                            <PlusIcon className="size-[20px]" />
                          </div>
                        </div>
                      </div>
                      <span className=" text-red-500 font-medium lg:block hidden w-[25%]">
                        {`$${
                          Math.round(
                            product.quantity * product.newPrice * 100
                          ) / 100
                        }  `}
                      </span>

                      <div className="lg:block hidden w-[25%]">
                        <button
                          className=" w-fit"
                          onClick={() => removeToCart(product)}
                        >
                          <TrashIcon className="size-[25px] text-red-500 " />
                        </button>
                      </div>
                    </Link>
                  </div>
                );
              })
            )}
            <Waypoint
              onEnter={() => setIsScrollLast(true)}
              onLeave={() => setIsScrollLast(false)}
            >
              <div
                className={`flex lg:flex-row flex-col lg:items-center  justify-between lg:px-[40px] lg:py-4 rounded shadow-add py-5 px-4  gap-4 w-full bg-white transition-all duration-300 `}
              >
                <div className="flex items-center gap-2">
                  <span className="lg:text-[18px] text-[16px]">
                    Total to pay
                  </span>
                  <span className="lg:text-[20px] text-[18px] font-medium text-[#db4444]">{`$${
                    Math.round(totalPriceProductsSelected * 100) / 100
                  }`}</span>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    className="bg-[#db4444] lg:px-14 px-10 py-3 text-white font-medium text-[16px] leading-[24px] w-[140px] lg:lg:w-fit rounded"
                    onClick={handleCheckOut}
                  >
                    {productChecked.length > 0
                      ? `Buy (${productChecked.length})`
                      : "Buy"}
                  </button>
                </div>
              </div>
            </Waypoint>
            <div
              className={`lg:pl-[152px] lg:pr-[135px] pl-[20px] pr-[20px]  ${
                isScrollLast ? "checkout hidden" : "checkout"
              } ${isScrollFooter ? "checkout hidden" : ""}
              ${canBuy ? "lg:pl-[135px]" : ""} `}
            >
              <div className="bg-white w-full h-full flex lg:flex-row flex-col lg:items-center justify-between lg:px-[40px] lg:py-4 rounded shadow-add py-5 px-4 ">
                <div className="flex items-center gap-2">
                  <span className="lg:text-[18px] text-[16px]">
                    Total to pay
                  </span>
                  <span className="lg:text-[20px] text-[18px] font-medium text-[#db4444]">{`$${
                    Math.round(totalPriceProductsSelected * 100) / 100
                  }`}</span>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    className="bg-[#db4444] lg:px-14 px-10 py-3 text-white font-medium text-[16px] leading-[24px] w-[140px] rounded lg:w-fit"
                    onClick={handleCheckOut}
                  >
                    {productChecked.length > 0
                      ? `Buy (${productChecked.length})`
                      : "Buy"}
                  </button>
                </div>
              </div>
            </div>

            {/* <div className="pt-[40px] flex justify-end sticky bottom-0">
              <div className="border border-black rounded px-[24px] py-[32px] flex flex-col gap-[24px] ">
                <span className="text-[20px] font-medium leading-[28px]">
                  Cart Total
                </span>
                <div className="border-b-2 border-gray-300 pb-2 flex items-center  justify-between text-[16px] font-normal leading-[24px]">
                  <span className="">Total Amount:</span>
                  <span className="text-[#DB4444] font-medium text-[18px] w-[200px] text-end">{`$${
                    Math.round(totalPriceProductsSelected * 100) / 100
                  }`}</span>
                </div>
                <button
                  className="bg-[#DB4444] px-[48px] py-4 text-white font-medium text-[16px] leading-[24px] rounded w-fit mx-auto"
                  onClick={handleCheckOut}
                >
                  Checkout
                </button>
              </div>
            </div> */}
          </div>
        </>
      )}
      <Waypoint
        onEnter={() => setIsScrollFooter(true)}
        onLeave={() => setIsScrollFooter(false)}
      >
        <div>
          <Footer />
        </div>
      </Waypoint>
    </div>
  );
};
export default Cart;
