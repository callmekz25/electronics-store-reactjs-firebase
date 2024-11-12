import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { Error } from "./Error";
import { SendOrderConfirmation } from "../Service/SendMail";
import { ToastContainer } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PaypalIcon from "../Assets/Payment/paypal.png";
import CodIcon from "../Assets/Payment/cash-on-delivery.png";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const [loadingChange, setLoadingChange] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [dateTransaction, setDateTransaction] = useState("");
  const { currentUser } = useContext(UserContext);
  const queryClient = useQueryClient();
  // paypal option
  const initialOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
  };
  const [optionPay, setOptionPay] = useState("cod");
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [info, setInfo] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  // State để kiểm tra lỗi form
  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  // Khi load được thông tin user đã đăng nhập
  useEffect(() => {
    if (user) {
      setInfo({
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
      });
    }
  }, [user]);
  // State lấy từ bên product details
  const { products, total } = location.state || {
    products: [],
    total: 0,
  };

  // Hàm xử lí kiểm tra thông tin trước khi order
  const handleOrder = async (product, user, total, methodPay) => {
    let hasErrors = false;
    if (!info.name) {
      setErrorName("Name cann't empty!");
      hasErrors = true;
    } else {
      setErrorName("");
    }
    if (!info.email) {
      setErrorEmail("Email cann't empty!");
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(info.email)) {
      setErrorEmail("Email is invalid!");
      hasErrors = true;
    } else {
      setErrorEmail("");
    }
    if (!info.address) {
      setErrorAddress("Address cann't empty!");
      hasErrors = true;
    } else {
      setErrorAddress("");
    }
    if (!info.phone) {
      setErrorPhone("Phone number cann't empty!");
      hasErrors = true;
    } else if (!info.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
      setErrorPhone("Phone number is invalid!");
      hasErrors = true;
    } else {
      setErrorPhone("");
    }
    if (!hasErrors) {
      setLoadingChange(true);
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let currDay = `${day}/${month}/${year} ${hour}:${minute}`;
      let status = "Pending";
      let orderId = uuid();
      // Collection để lưu orders của từng users
      const orderRef = doc(db, "Orders", orderId);
      // Collection để lưu tất cả orders để dễ truy vấn
      const allOrdersRef = doc(db, "AllOrders", orderId);
      // Collection để lưu sản phẩm đã order để tính toán best selling

      const ordersData = {
        userId: currentUser.uid,
        orderId: orderId,
        createdAt: currDay,
        total: total,
        status: status,
        products: product.map((p) => ({
          image: p.img,
          productId: p.id,
          name: p.name,
          quantity: p.quantity,
          price: p.newPrice,
        })),
        pay: methodPay,
      };
      const ordersUserDataAdmin = {
        userId: currentUser.uid,
        orderId: orderId,
        email: user.email,
        name: user.name,
        address: user.address || "",
        phone: user.phone || "",
        createdAt: currDay,
        pay: methodPay,
        total: total,
        status: status,
        products: product.map((p) => ({
          image: p.img,
          productId: p.id,
          name: p.name,
          quantity: p.quantity,
          price: p.newPrice,
        })),
      };

      await setDoc(orderRef, ordersData);
      // Post lên all orders
      await setDoc(allOrdersRef, ordersUserDataAdmin);
      setDateTransaction(date.toString());
      // Gửi email confirm
      SendOrderConfirmation(product, user, total);
      setLoadingChange(false);
      setOrderSuccess(true);
      window.scrollTo(0, 0);
      // Chuyển trang tới page orders của user
      // Component chưa được mount sẽ không fetch lại dữ liệu mà phải dùng refetch để fetch lại dữ liệu bất kể mount hay chưa
      queryClient.invalidateQueries(["orders", user?.userId]);
      queryClient.refetchQueries(["orders", user?.userId]);
    }
  };
  const handleOrderByPaypal = async (product, user, total, methodPay) => {
    setLoadingChange(true);
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let currDay = `${day}/${month}/${year} ${hour}:${minute}`;
    let status = "Pending";
    let orderId = uuid();
    // Collection để lưu orders của từng users
    const orderRef = doc(db, "Orders", orderId);
    // Collection để lưu tất cả orders để dễ truy vấn
    const allOrdersRef = doc(db, "AllOrders", orderId);
    // Collection để lưu sản phẩm đã order để tính toán best selling

    const ordersData = {
      userId: currentUser.uid,
      orderId: orderId,
      createdAt: currDay,
      total: total,
      status: status,
      products: product.map((p) => ({
        image: p.img,
        productId: p.id,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
      pay: methodPay,
    };
    const ordersUserDataAdmin = {
      userId: currentUser.uid,
      orderId: orderId,
      email: user.email,
      name: user.name,
      address: user.address || "",
      phone: user.phone || "",
      createdAt: currDay,
      pay: methodPay,
      total: total,
      status: status,
      products: product.map((p) => ({
        image: p.img,
        productId: p.id,
        name: p.name,
        quantity: p.quantity,
        price: p.price,
      })),
    };
    await setDoc(orderRef, ordersData);
    // Post lên all orders
    await setDoc(allOrdersRef, ordersUserDataAdmin);

    // Gửi email confirm
    SendOrderConfirmation(product, user, total);
    setLoadingChange(false);
    // Chuyển trang tới page orders của user
    // Component chưa được mount sẽ không fetch lại dữ liệu mà phải dùng refetch để fetch lại dữ liệu bất kể mount hay chưa
    queryClient.invalidateQueries(["orders", user?.userId]);
    queryClient.refetchQueries(["orders", user?.userId]);
    navigate("/orders/purchase/status=all");
  };

  // Tạo order của paypal có giá tiền bằng tổng tiền thanh toán
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total, // Số tiền cần thanh toán
          },
        },
      ],
    });
  };

  return (
    <div className="bg-white">
      <PayPalScriptProvider options={initialOptions}>
        <div className=" pb-[100px]">
          <Nav />
          {orderSuccess ? (
            <div className="flex items-center justify-center mt-16 mb-32">
              <div className="border-2 border-gray-100 rounded-lg p-5">
                <div className="flex items-center justify-center flex-col gap-2 px-14 pb-4 border-b border-gray-100">
                  <CheckCircleIcon className="size-16 text-[#00a991]" />
                  <span className="text-[22px] font-medium">
                    Thanks for your order!
                  </span>
                  <span className="text-[15px] text-gray-400 font-normal">
                    The order confirmation has been sent to {info.email}
                  </span>
                </div>
                <div className="py-4 flex flex-col gap-2 pb-4 border-b border-gray-200">
                  <span className="font-medium text-[16px] opacity-70">
                    Transaction Date
                  </span>
                  <span>{dateTransaction}</span>
                </div>
                <div className="flex flex-col gap-2 py-4 border-b border-gray-200">
                  <span className="font-medium text-[16px] opacity-70">
                    Payment Method
                  </span>
                  <span className="text-[14px] text-gray-400 font-normal">
                    Cash on delivery
                  </span>
                </div>
                <div className=" flex flex-col gap-3 py-4 ">
                  <span className="font-medium text-[16px] opacity-70">
                    Your Order
                  </span>
                  {products.map((product) => {
                    return (
                      <div
                        className="flex items-center gap-4 py-4 border-b border-gray-200"
                        key={product.id}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center py-2 px-3 rounded-md bg-[#d1d6da]">
                            <LazyLoadImage
                              effect="blur"
                              src={product.img}
                              alt={product.name}
                              className="size-[60px] object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between h-full w-full">
                          <div className="flex flex-col justify-between">
                            <span className=" overflow-hidden text-ellipsis">
                              {product.name}
                            </span>
                            <div className="flex items-center text-[14px] text-[#aeb4bc]">
                              <span>
                                {product.infomation
                                  ? product.infomation.type
                                  : ""}
                              </span>
                              {product.cate === "phone" &&
                              product.colorActive ? (
                                <div
                                  className={`size-4 rounded-full 
                                    `}
                                  style={{
                                    backgroundColor: product.colorActive,
                                  }}
                                ></div>
                              ) : (
                                ""
                              )}
                              {product.cate === "laptop" &&
                              product.colorActive ? (
                                <div
                                  className={`size-4 rounded-full 
                                    `}
                                  style={{
                                    backgroundColor: product.colorActive,
                                  }}
                                ></div>
                              ) : (
                                ""
                              )}
                            </div>
                            <span className="text-[13px]">
                              x {product.quantity}
                            </span>
                          </div>
                          <span className="font-semibold opacity-70 text-[17px]">
                            $
                            {Math.round(
                              product.newPrice * product.quantity * 100
                            ) / 100}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <span className="font-normal opacity-80 text-[15px]">
                    Subtotal
                  </span>
                  <span className="font-semibold opacity-70 text-[17px]">
                    ${Math.round(total * 100) / 100}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="font-normal text-[#95a1b0] text-[15px]">
                    Applied discount code
                  </span>
                  <div className="font-semibold opacity-70 px-5 py-1.5 flex items-center justify-center rounded-md text-[15px] bg-[#ebeef2]">
                    20%
                  </div>
                </div>
                <div className="flex items-center justify-between py-4">
                  <span className="font-normal text-[#95a1b0] text-[15px]">
                    Discount
                  </span>
                  <span className="font-normal opacity-70 text-[15px] text-[#898c90]">
                    -$0
                  </span>
                </div>
                <div className="flex items-center justify-between border-b pb-4 border-gray-200">
                  <span className="font-normal text-[#95a1b0] text-[15px]">
                    Shipment cost
                  </span>
                  <span className="font-normal opacity-70 text-[15px] text-[#898c90]">
                    $25.5
                  </span>
                </div>
                <div className="flex items-center justify-between py-4">
                  <span className=" opacity-70 font-medium">Grand total</span>
                  <span className="font-semibold opacity-70 text-[22px]">
                    ${Math.round(total * 100) / 100}
                  </span>
                </div>
                <button
                  className="w-full py-3 mt-2 text-[15px] bg-black text-white rounded-md"
                  onClick={() => navigate("/orders/purchase/status=all")}
                >
                  Go to your order
                </button>
              </div>
            </div>
          ) : loading ? (
            <Loading />
          ) : products && user ? (
            <div className="lg:px-[100px] px-[20px] mb-[200px]">
              <div className="">
                <div className="flex items-center gap-2 py-[80px]">
                  <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                    Home
                  </span>
                  <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                    /
                  </span>
                  <span className="text-black text-[14px] font-normal  leading-[21px]">
                    CheckOut
                  </span>
                </div>
              </div>
              <>
                <div className="grid grid-cols-3 gap-10 ">
                  <div
                    className="col-span-2 flex flex-col gap-4"
                    data-aos="fade-in"
                  >
                    <div className=" flex flex-col gap-5 col-span-2 p-5 border-2 border-gray-100 rounded-lg text-[16px] font-normal h-fit leading-[24px]">
                      <span className="font-medium">Shipping Address</span>
                      <div className="relative flex flex-col gap-2 text-[15px]">
                        <label
                          htmlFor="bname"
                          className="opacity-80"
                        >
                          <span>Full name</span>
                          <span className="text-black">*</span>
                        </label>
                        <input
                          type="text"
                          id="bname"
                          value={info.name}
                          className={`py-3 px-3 bg-[#f9fafb] rounded-md border-2 border-gray-100 outline-none ${
                            errorName
                              ? "border-[#fc3939] border-2 bg-[#fff9f9]"
                              : ""
                          }`}
                          placeholder="Enter you full name"
                          onChange={(e) =>
                            setInfo({
                              name: e.target.value,
                              address: info.address,
                              phone: info.phone,
                              email: info.email,
                            })
                          }
                          onInput={() => setErrorName("")}
                        />
                        <span className="text-red-500 text-[13px]  absolute bottom-[-27px] font-normal ml-1">
                          {errorName}
                        </span>
                      </div>
                      <div className="relative flex flex-col gap-2 text-[15px]">
                        <label
                          htmlFor="bemail"
                          className="opacity-80"
                        >
                          <span>Email</span>
                          <span className="text-black">*</span>
                        </label>
                        <input
                          type="text"
                          id="bemail"
                          value={info.email}
                          className={`py-3 px-3 bg-[#f9fafb] rounded-md border-2 border-gray-100 outline-none ${
                            errorEmail
                              ? "border-[#fc3939] border-2 bg-[#fff9f9]"
                              : ""
                          }`}
                          placeholder="Enter your email address"
                          onChange={(e) =>
                            setInfo({
                              name: info.name,
                              email: e.target.value,
                              address: info.address,
                              phone: info.phone,
                            })
                          }
                          onInput={() => setErrorEmail("")}
                        />
                        <span className="text-red-500 text-[13px]  absolute bottom-[-27px] font-normal ml-1">
                          {errorEmail}
                        </span>
                      </div>
                      <div className="relative flex flex-col gap-2 text-[15px]">
                        <label
                          htmlFor="bphone"
                          className="opacity-80"
                        >
                          <span>Phone number</span>
                          <span className="text-black">*</span>
                        </label>
                        <input
                          type="text"
                          id="bphone"
                          value={info.phone}
                          className={`py-3 px-3 bg-[#f9fafb] rounded-md border-2 border-gray-100 outline-none ${
                            errorPhone
                              ? "border-[#fc3939] border-2 bg-[#fff9f9]"
                              : ""
                          }`}
                          placeholder="Enter your phone number"
                          onChange={(e) =>
                            setInfo({
                              phone: e.target.value,
                              name: info.name,
                              email: info.email,
                              address: info.address,
                            })
                          }
                          onInput={() => setErrorPhone("")}
                        />
                        <span className="text-red-500 text-[13px]  absolute bottom-[-27px] font-normal ml-1">
                          {errorPhone}
                        </span>
                      </div>
                      <div className="relative flex flex-col gap-2 text-[15px]">
                        <label
                          htmlFor="baddress"
                          className="opacity-80"
                        >
                          <span> Address</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="baddress"
                          value={info.address}
                          className={`py-3 px-3 bg-[#f9fafb] rounded-md border-2 border-gray-100 outline-none ${
                            errorAddress
                              ? "border-[#fc3939] border-2 bg-[#fff9f9]"
                              : ""
                          }`}
                          placeholder="Enter your address"
                          onChange={(e) =>
                            setInfo({
                              address: e.target.value,
                              name: info.name,
                              email: info.email,
                              phone: info.phone,
                            })
                          }
                          onInput={() => setErrorAddress("")}
                        />
                        <span className="text-red-500 text-[13px]  absolute bottom-[-27px] font-normal ml-1">
                          {errorAddress}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-5 col-span-2 p-5 border-2 border-gray-100 rounded-lg text-[16px] font-normal leading-[24px]">
                      <span className="font-medium">Select payment method</span>
                      <div className="flex flex-col gap-4">
                        <div className="border-2 border-gray-100 rounded-md px-3 pr-6 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="pay"
                              id="cod"
                              className="size-4 hover:cursor-pointer"
                            />
                            <label
                              htmlFor="cod"
                              className="text-[15px]"
                            >
                              Cash On Delivery
                            </label>
                          </div>
                          <LazyLoadImage
                            src={CodIcon}
                            className="w-[55px] h-[32px] object-contain"
                          />
                        </div>
                        <div className="border-2 border-gray-100 rounded-md px-3 pr-6 py-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="pay"
                              id="paypal"
                              className="size-4 hover:cursor-pointer"
                            />
                            <label
                              htmlFor="paypal"
                              className="text-[15px]"
                            >
                              Paypal
                            </label>
                          </div>
                          <LazyLoadImage
                            src={PaypalIcon}
                            className="w-[55px] h-[32px] object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex flex-col gap-5 p-5  border-2 border-gray-100 rounded-lg text-[16px] font-normal  leading-[24px] h-fit"
                    data-aos="fade-in"
                  >
                    <span className="font-medium">Your Order</span>
                    {products.map((product) => {
                      return (
                        <div
                          className="flex items-center gap-4 pb-4 border-b border-gray-200"
                          key={product.id}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center py-2 px-3 rounded-md bg-[#d1d6da]">
                              <LazyLoadImage
                                effect="blur"
                                src={product.img}
                                alt={product.name}
                                className="size-[60px] object-contain"
                              />
                            </div>
                          </div>
                          <div className="flex justify-between h-full w-[80%]">
                            <div className="flex flex-col justify-between">
                              <span className="overflow-hidden text-ellipsis">
                                {product.name}
                              </span>
                              <div className="flex items-center text-[14px] text-[#aeb4bc]">
                                <span>
                                  {product.infomation
                                    ? product.infomation.type
                                    : ""}
                                </span>
                                {product.cate === "phone" &&
                                product.colorActive ? (
                                  <div
                                    className={`size-4 rounded-full 
                                    `}
                                    style={{
                                      backgroundColor: product.colorActive,
                                    }}
                                  ></div>
                                ) : (
                                  ""
                                )}
                                {product.cate === "laptop" &&
                                product.colorActive ? (
                                  <div
                                    className={`size-4 rounded-full 
                                    `}
                                    style={{
                                      backgroundColor: product.colorActive,
                                    }}
                                  ></div>
                                ) : (
                                  ""
                                )}
                              </div>
                              <span className="text-[13px]">
                                x {product.quantity}
                              </span>
                            </div>
                            <span className="font-semibold opacity-70 text-[17px]">
                              $
                              {Math.round(
                                product.newPrice * product.quantity * 100
                              ) / 100}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex flex-col gap-2 pb-5 border-b border-gray-200">
                      <span className="font-medium">Discount Code</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add discount code"
                          className="px-3 py-2 rounded-md border-2 border-gray-100 bg-[#f9fafb] text-[14px] outline-none w-full"
                        />
                        <button className="border-2 border-gray-100 px-3 py-2 rounded-md text-[15px]">
                          Apply
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 pb-5 border-b border-gray-200">
                      <div className="flex items-center justify-between ">
                        <span className="font-normal text-[#95a1b0] text-[15px]">
                          Subtotal:
                        </span>
                        <span className="font-semibold opacity-70 text-[17px]">
                          ${Math.round(total * 100) / 100}
                        </span>
                      </div>

                      <div className="flex items-center justify-between ">
                        <span className="font-normal text-[#95a1b0] text-[15px]">
                          Discount:
                        </span>
                        <span className="font-normal opacity-70 text-[15px] text-[#898c90]">
                          -$0
                        </span>
                      </div>
                      <div className="flex items-center justify-between ">
                        <span className="font-normal text-[#95a1b0] text-[15px]">
                          Shipment cost:
                        </span>
                        <span className="font-normal opacity-70 text-[15px] text-[#898c90]">
                          $22.5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className=" opacity-70 font-medium">
                        Grand total
                      </span>
                      <span className="font-semibold opacity-70 text-[22px]">
                        ${Math.round(total * 100) / 100}
                      </span>
                    </div>

                    {/* <div className="flex flex-col gap-2">
                      <span>Choose method to pay</span>
                      <div className="flex flex-col gap-4 border border-black rounded py-4 px-5">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="cash"
                            id="cod"
                            className="size-4 hover:cursor-pointer"
                            checked={optionPay === "cod" ? true : false}
                            onChange={() => setOptionPay("cod")}
                          />
                          <label htmlFor="cod">Cash On Delivery (COD)</label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="cash"
                            id="pp"
                            checked={optionPay === "pp" ? true : false}
                            className="size-4 hover:cursor-pointer"
                            onChange={() => setOptionPay("pp")}
                          />
                          <label htmlFor="pp">PayPal Payment (PP)</label>
                        </div>
                      </div>
                    </div> */}
                    <div className="flex items-center">
                      <button
                        className=" rounded-md bg-black w-full  py-3 text-white text-[16px] font-medium leading-[24px]"
                        onClick={() =>
                          handleOrder(products, info, total, "cod")
                        }
                      >
                        Order
                      </button>
                      {/* {optionPay === "cod" && (
                      )}
                      {optionPay === "pp" && (
                        <PayPalButtons
                          disabled={false}
                          createOrder={createOrder}
                          onApprove={() =>
                            handleOrderByPaypal(products, info, total, "pp")
                          }
                        />
                      )} */}
                    </div>
                  </div>
                </div>
              </>
            </div>
          ) : (
            <Error />
          )}
          {loadingChange ? (
            <div className="overlay">
              <div className="spinner-overlay"></div>
            </div>
          ) : (
            ""
          )}
        </div>
        <Footer />
        <ToastContainer />
      </PayPalScriptProvider>
    </div>
  );
};
export default Checkout;
