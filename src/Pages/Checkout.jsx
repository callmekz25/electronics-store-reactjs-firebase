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
const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const [loadingChange, setLoadingChange] = useState(false);
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
  const handleCheck = () => {
    let hasErrors = false;
    // Kiểm tra trực tiếp giá trị của 'info' object
    if (!info.name) {
      setErrorName("Name can't be empty!");
      hasErrors = true;
    } else {
      setErrorName("");
    }
    if (!info.email) {
      setErrorEmail("Email can't be empty!");
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(info.email)) {
      setErrorEmail("Email is invalid!");
      hasErrors = true;
    } else {
      setErrorEmail("");
    }

    if (!info.address) {
      setErrorAddress("Address can't be empty!");
      hasErrors = true;
    } else {
      setErrorAddress("");
    }
    if (!info.phone) {
      setErrorPhone("Phone number can't be empty!");
      hasErrors = true;
    } else if (!info.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
      setErrorPhone("Phone number is invalid!");
      hasErrors = true;
    } else {
      setErrorPhone("");
    }
    return hasErrors;
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
    <PayPalScriptProvider options={initialOptions}>
      <div className="lg:px-[135px] px-[20px]">
        <Nav />
        {loading || loadingChange ? (
          <Loading />
        ) : products && user ? (
          <>
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
              <span className="text-[36px] font-medium leading-[30px] tracking-[1.44px]">
                Billing Details
              </span>
              <div className="grid grid-cols-2 gap-[150px] py-[48px]">
                <form className=" flex flex-col gap-[32px] text-[16px] font-normal leading-[24px]">
                  <div className="relative flex flex-col gap-2">
                    <label
                      htmlFor="bname"
                      className="opacity-40"
                    >
                      <span>Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bname"
                      value={info.name}
                      className={`py-3 px-3 bg-[#efebeb] rounded outline-none ${
                        errorName
                          ? "border-[#fc3939] border-2 bg-[#fff9f9]"
                          : ""
                      }`}
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
                  <div className="relative flex flex-col gap-2">
                    <label
                      htmlFor="bemail"
                      className="opacity-40"
                    >
                      <span>Email</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bemail"
                      value={info.email}
                      className={`py-3 px-3 bg-[#efebeb] rounded outline-none ${
                        errorEmail
                          ? "border-[#fc3939] border-2 bg-[#fff9f9]"
                          : ""
                      }`}
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
                  <div className="relative flex flex-col gap-2">
                    <label
                      htmlFor="bphone"
                      className="opacity-40"
                    >
                      <span>Phone Number</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="bphone"
                      value={info.phone}
                      className={`py-3 px-3 bg-[#efebeb] rounded outline-none ${
                        errorPhone
                          ? "border-[#fc3939] border-2 bg-[#fff9f9]"
                          : ""
                      }`}
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
                  <div className="relative flex flex-col gap-2">
                    <label
                      htmlFor="baddress"
                      className="opacity-40"
                    >
                      <span> Address</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="baddress"
                      value={info.address}
                      className={`py-3 px-3 bg-[#efebeb] rounded outline-none ${
                        errorAddress
                          ? "border-[#fc3939] border-2 bg-[#fff9f9]"
                          : ""
                      }`}
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
                </form>
                <div className="flex flex-col gap-[32px] py-[50px] text-[16px] font-normal  leading-[24px]">
                  {products.map((product) => {
                    return (
                      <div
                        className="flex items-center justify-between"
                        key={product.id}
                      >
                        <div className="flex items-center gap-4">
                          <LazyLoadImage
                            effect="blur"
                            src={product.img}
                            alt={product.name}
                            className="size-[60px] object-contain"
                          />
                          <span>{product.name}</span>
                          <span>x {product.quantity}</span>
                          <span>
                            {product.color
                              ? product.color.charAt(0).toUpperCase() +
                                product.color.slice(1)
                              : ""}
                          </span>
                        </div>
                        <span>
                          $
                          {Math.round(product.price * product.quantity * 100) /
                            100}
                        </span>
                      </div>
                    );
                  })}

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between ">
                      <span className="font-medium">Subtotal:</span>
                      <span>${Math.round(total * 100) / 100}</span>
                    </div>
                    <div className="border-b border-black"></div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between ">
                      <span className="font-medium">Shipping:</span>
                      <span>Free</span>
                    </div>
                    <div className="border-b border-black"></div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between ">
                      <span className="font-semibold text-[20px]">Total:</span>
                      <span className="font-medium text-[18px]">
                        ${Math.round(total * 100) / 100}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
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
                  </div>
                  <div className="flex items-center justify-end pt-5 min-h-[140px]">
                    {optionPay === "cod" && (
                      <button
                        className=" rounded bg-[#DB4444] px-[48px] py-2 text-white text-[16px] font-medium leading-[24px]"
                        onClick={() =>
                          handleOrder(products, info, total, "cod")
                        }
                      >
                        Order
                      </button>
                    )}
                    {optionPay === "pp" && (
                      <PayPalButtons
                        onClick={(data, actions) => {
                          let hasErrors = handleCheck();
                          console.log(hasErrors);
                          if (hasErrors) {
                            return actions.reject();
                          }
                          return actions.resolve();
                        }}
                        createOrder={createOrder}
                        onApprove={() =>
                          handleOrderByPaypal(products, info, total, "pp")
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          </>
        ) : (
          <Error />
        )}
        <Footer />

        <ToastContainer />
      </div>
    </PayPalScriptProvider>
  );
};
export default Checkout;
