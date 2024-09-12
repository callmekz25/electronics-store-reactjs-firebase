import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useCart } from "react-use-cart";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../Context/UserContext";
import { Error } from "./Error";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import SkeletonCart from "../components/SkeletonCart";
import useMobile from "../Hooks/useMobile";
import ScrollTrigger from "react-scroll-trigger";
// Firestore & auth từ firebase
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useQuery } from "@tanstack/react-query";
import { fetchCartsByUser } from "../FetchAPI/FetchAPI";

const Cart = () => {
  const { user, loading } = useContext(UserContext);
  const [isScrollLast, setIsScrollLast] = useState(false);
  const [isScrollFooter, setIsScrollFooter] = useState(false);
  // State lấy những products user checked
  const [productChecked, setProductChecked] = useState([]);
  // Popup cần chọn sản phẩm để buy
  const [canBuy, setCanBuy] = useState(false);
  // Sử dụng thư viện thứ 3 react use cart
  const { isEmpty, setItems, items, updateItemQuantity } = useCart();
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["carts", user?.userId],
    queryFn: () => fetchCartsByUser(user),
  });

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  // Hàm xử lí khi người dùng loại 1 sản phẩm khỏi giỏ hàng và fetch lên firestore để update
  const handleRemoveItem = async (product) => {
    if (user) {
      if (user.role === "user") {
        // setUser(user);
        // Lấy ra những items đã add carts khác id với sản phẩm người dùng bấm remove
        const updateItems = items.filter((f) => f.id !== product.id);
        // Set state lại những sản phẩm đã lọc qua
        setItems(updateItems);
        // Update lên firestore của người dùng
        // Xóa document trong Firestore
        const cartRef = doc(db, `Carts`, user.userId, "Product", product.id);
        // Xóa document tương ứng với productId bị remove
        await deleteDoc(cartRef);
        if (deleteDoc) {
          toast.success(`Remove ${product.name} successfully `, {
            position: "top-center",
            autoClose: 1500,
          });
        }
      }
    }
  };
  const handleUpdateQuantityPlus = async (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (user) {
      if (user.role === "user") {
        const quantity = product.quantity + 1;
        const cartRef = doc(db, `Carts`, user.userId, "Product", product.id);

        await updateDoc(cartRef, {
          quantity: quantity,
        });
      }
    }
  };
  const handleUpdateQuantityMinus = async (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (user) {
      if (user.role === "user") {
        const quantity = product.quantity - 1;
        const cartRef = doc(db, `Carts`, user.userId, "Product", product.id);

        await updateDoc(cartRef, {
          quantity: quantity,
        });
      }
    }
  };
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
      toast.warn("Please choose your product want to check out");
    } else {
      const ids = productChecked.map((product) => product.id).join(",");
      navigate(`/checkout/state=/${ids}`, {
        state: {
          products: productChecked,
          total: totalPriceProductsSelected,
        },
      });
    }
  };
  if (isError) {
    return <Error />;
  }
  return (
    <div className="lg:px-[135px]">
      <Nav />
      {loading || isLoading ? (
        <SkeletonCart />
      ) : (
        <>
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
            {!items ? (
              <div className="flex items-center justify-center py-[100px]">
                <span className="text-[20px] font-normal leading-[24px] text-[#999999]">
                  Your cart is empty
                </span>
              </div>
            ) : (
              items.map((product) => {
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
                                  updateItemQuantity(
                                    product.id,
                                    product.quantity - 1
                                  );
                                  handleUpdateQuantityMinus(product, e);
                                } else {
                                  handleRemoveItem(product);
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
                                updateItemQuantity(
                                  product.id,
                                  product.quantity + 1
                                );
                                handleUpdateQuantityPlus(product, e);
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
                          onClick={() => handleRemoveItem(product)}
                        >
                          <TrashIcon className="size-[25px] text-red-500 " />
                        </button>
                      </div>
                    </Link>
                  </div>
                );
              })
            )}

            <ScrollTrigger
              onEnter={() => setIsScrollLast(true)}
              onExit={() => setIsScrollLast(false)}
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
            </ScrollTrigger>
            <div
              className={`lg:pl-[152px] lg:pr-[135px] pl-[20px] pr-[20px]  ${
                isScrollLast ? "checkout hidden" : "checkout"
              } ${isScrollFooter ? "checkout hidden" : ""}`}
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
      <ScrollTrigger
        onEnter={() => setIsScrollFooter(true)}
        onExit={() => setIsScrollFooter(false)}
      >
        <Footer />
      </ScrollTrigger>
      <ToastContainer />
    </div>
  );
};
export default Cart;
