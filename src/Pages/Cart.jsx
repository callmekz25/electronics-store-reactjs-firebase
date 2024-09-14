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
  if (isError) {
    return <Error />;
  }
  return (
    <div className="lg:px-[135px]">
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
          <div className="flex flex-col gap-[40px] text-[16px] font-normal leading-[24px] pb-[50px] px-[20px] lg:px-0  relative">
            <div className="lg:flex hidden items-center justify-between px-[40px] py-[24px] rounded shadow-cart font-medium gap- bg-white">
              <div className="flex items-center justify-between gap-4 w-[69%]">
                <span className="">Products</span>
              </div>
              <div className="lg:flex lg:w-full lg:justify-between lg:items-center ">
                <span className="">Types</span>
                <span className="">Price</span>
                <span className="">Quantity</span>
                <span className="">Subtotal</span>
                <span className="">Actions</span>
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
                    className="lg:flex lg:items-center lg:gap-[20px] lg:px-[40px] lg:py-[24px] rounded shadow-cart p-3 grid grid-cols-3 gap-4 bg-white"
                    key={product.id}
                  >
                    <div className="flex items-center gap-3 lg:justify-between lg:gap-4 col-span-1 lg:w-[10%]">
                      <input
                        type="checkbox"
                        name="chechbox cart"
                        id=""
                        className="lg:size-5 size-8 hover:cursor-pointer"
                        onChange={() => handleSelectedProducts(product)}
                      />
                      <Link
                        to={`/dp/${product.name}/${product.id}`}
                        className="flex items-center gap-4"
                      >
                        <LazyLoadImage
                          src={product.img}
                          className="size-[80px] object-contain"
                          effect="blur"
                        />
                      </Link>
                    </div>
                    <Link
                      to={isMobile ? `/dp/${product.name}/${product.id}` : ""}
                      className=" col-span-2 lg:flex lg:w-full lg:justify-between lg:items-center flex flex-col lg:flex-row hover:cursor-default"
                    >
                      <span className="font-normal overflow-hidden text-ellipsis whitespace-nowrap lg:w-[250px] lg:text-[17px] text-[16px]">
                        {product.name}
                      </span>
                      <span className=" text-[14px] text-gray-500">
                        {product.color
                          ? product.color.charAt(0).toUpperCase() +
                            product.color.slice(1)
                          : ""}
                        {product.size ? "," : "None"}
                        {product.size}
                      </span>
                      <div className="flex items-center justify-between lg:gap-14 lg:mt-0 mt-4">
                        <span className="text-red-500 lg:text-black lg:font-normal  font-medium lg:text-[16px] text-[17px]">{`$${product.price}`}</span>
                        <div className="">
                          <div className="w-fit flex items-center border border-gray-400 rounded-s lg:py-1 rounded-e lg:px-2 px-1">
                            <div
                              className="flex items-center justify-center hover:cursor-pointer text-[16px]"
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
                            <div className="flex items-center justify-center lg:w-[50px] w-[30px] text-[17px] font-medium leading-[28px]">
                              {product.quantity}
                            </div>
                            <div
                              className="flex items-center justify-center hover:cursor-pointer text-[16px]"
                              onClick={(e) => {
                                updatePlus(product, e);
                              }}
                            >
                              <PlusIcon className="size-[20px]" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <span className=" text-red-500 font-medium lg:block hidden">
                        {`$${
                          Math.round(product.quantity * product.price * 100) /
                          100
                        }  `}
                      </span>

                      <div className="lg:block hidden">
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
                className={`flex items-center  justify-between lg:px-[40px] lg:py-[24px] rounded shadow-add py-5 px-4  gap-4 w-full bg-white transition-all duration-300 `}
              >
                <div className="flex items-center gap-2">
                  <span>Total to pay ({productChecked.length} products):</span>
                  <span className="lg:text-[20px] text-[#db4444]">{`$${
                    Math.round(totalPriceProductsSelected * 100) / 100
                  }`}</span>
                </div>
                <button
                  className="bg-[#db4444] px-14 py-3 text-white font-medium text-[16px] leading-[24px]  w-fit rounded"
                  onClick={handleCheckOut}
                >
                  Buy
                </button>
              </div>
            </Waypoint>
            <div
              className={`lg:pl-[152px] lg:pr-[135px] pl-[20px] pr-[20px]  ${
                isScrollLast ? "checkout hidden" : "checkout"
              } ${isScrollFooter ? "checkout hidden" : ""}
              ${canBuy ? "lg:pl-[135px]" : ""} `}
            >
              <div className="bg-white w-full h-full flex items-center justify-between lg:px-[40px] lg:py-[24px] rounded shadow-add py-5 px-4 ">
                <div className="flex items-center gap-2">
                  <span>Total to pay ({productChecked.length} products):</span>
                  <span className="lg:text-[20px] text-[#db4444]">{`$${
                    Math.round(totalPriceProductsSelected * 100) / 100
                  }`}</span>
                </div>
                <button
                  className="bg-[#db4444] px-14 py-3 text-white font-medium text-[16px] leading-[24px]  w-fit rounded"
                  onClick={handleCheckOut}
                >
                  Buy
                </button>
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
