import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { TrashIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { Error } from "./Error";
import { PlusIcon, MinusIcon, TagIcon } from "@heroicons/react/24/outline";
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
      return result + product.newPrice * product.quantity;
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
    <div className="bg-white">
      <Nav />
      {isLoading ? (
        <SkeletonCart />
      ) : (
        <div className="lg:px-[100px] mb-[200px] px-[20px]">
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
          <div className="grid lg:grid-cols-3 grid-cols-1  gap-6">
            <div className="lg:col-span-2 h-fit font-normal leading-[24px]  p-5  overflow-hidden  border-2 rounded-2xl">
              {!cartItems ? (
                <div className="flex items-center justify-center py-[100px]">
                  <span className="text-[20px] font-normal leading-[24px] text-[#999999]">
                    Your cart is empty
                  </span>
                </div>
              ) : (
                cartItems.map((product, index) => {
                  return (
                    <div
                      className={`flex lg:gap-4     bg-white  text-[15px] py-4  ${
                        index < cartItems.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                      key={product.id}
                    >
                      <div className="flex items-center gap-5 ">
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
                            <div className="flex items-center justify-center lg:py-3 lg:px-5 bg-gray-100 px-5 py-6 rounded-lg mr-3">
                              <LazyLoadImage
                                src={product.img}
                                className="lg:size-24 object-contain max-w-[70px] min-h-[80px]"
                                effect="blur"
                              />
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col justify-between">
                          <div className="flex flex-col">
                            <span className="font-medium text-[17px]">
                              {product.name}
                            </span>
                            <div
                              className={`items-center gap-1 ${
                                product.color ? "flex" : "hidden"
                              }`}
                            >
                              <span className="text-[13px]">Color: </span>
                              <span
                                className={`size-4 rounded-full shadow-lg bg-[${product.color}]`}
                              ></span>
                            </div>
                            <span>
                              Price:{" "}
                              <span className="text-[#666666]">
                                ${product.newPrice}
                              </span>
                            </span>
                          </div>
                          <div className=" items-center rounded-full py-1.5 px-3 w-fit my-2 gap-4 bg-[#f0f0f0] lg:hidden flex">
                            <MinusIcon
                              className="size-5 hover:cursor-pointer"
                              onClick={() => {
                                updateMinus(product);
                              }}
                            />
                            <span>{product.quantity}</span>
                            <PlusIcon
                              className="size-5 hover:cursor-pointer"
                              onClick={() => updatePlus(product)}
                            />
                          </div>
                          <span className="text-[19px] font-semibold">
                            $
                            {Math.round(
                              product.newPrice * product.quantity * 100
                            ) / 100}
                          </span>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                          <TrashIcon
                            className="size-6 text-red-500 hover:cursor-pointer"
                            onClick={() => removeToCart(product)}
                          />
                          <div className="hidden items-center rounded-full py-2 px-5 gap-4 bg-[#f0f0f0] lg:flex">
                            <MinusIcon
                              className="size-5 hover:cursor-pointer"
                              onClick={() => {
                                updateMinus(product);
                              }}
                            />
                            <span>{product.quantity}</span>
                            <PlusIcon
                              className="size-5 hover:cursor-pointer"
                              onClick={() => updatePlus(product)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {/* <Waypoint
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
              </Waypoint> */}
              {/* <div
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
              </div> */}
            </div>
            <div className=" border-2 border-gray-200 rounded-2xl p-5 h-fit ">
              <span className="text-[22px] font-semibold">Order Summary</span>
              <div className="flex flex-col gap-4 mt-3 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-[18px]">
                    ${Math.round(totalPriceProductsSelected * 100) / 100}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-semibold text-[18px]">$0</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span>Total</span>
                <span className="font-semibold text-[18px]">
                  ${Math.round(totalPriceProductsSelected * 100) / 100}
                </span>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div className="relative w-full">
                    <TagIcon className="size-5 absolute left-3.5 top-[50%] translate-y-[-50%] z-20 text-gray-400" />
                    <input
                      type="text"
                      className=" bg-[#f0f0f0] lg:w-auto w-full  placeholder:text-[13px] rounded-full pl-10 pr-3 py-3 outline-none"
                      placeholder="Add code to discount"
                    />
                  </div>
                  <button className="px-9 py-3 lg:flex hidden bg-black rounded-full text-white text-[13px] font-normal transition-all duration-500 hover:opacity-80">
                    Apply
                  </button>
                </div>
              </div>
              <button className="px-9 py-3 lg:hidden flex items-center justify-center w-full mt-4 bg-black rounded-full text-white text-[15px] font-normal transition-all duration-500 hover:opacity-80">
                Apply
              </button>
              <button
                className="bg-black rounded-full w-full py-3 px-2 flex items-center gap-2 text-white mt-6 text-[15px] justify-center font-normal transition-all duration-500 hover:opacity-80"
                onClick={() => handleCheckOut()}
              >
                Go to Checkout <ArrowRightIcon className="size-5 text-white" />
              </button>
            </div>
          </div>
        </div>
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
