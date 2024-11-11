import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import OrderProgress from "../components/OrderProgress";
import { Loading } from "../components/Loading";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Error } from "./Error";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fetchOrdersByOrderId } from "../FetchAPI/FetchAPI";
import { useQuery } from "@tanstack/react-query";

const OrderDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoadding] = useState(false);
  const [steps, setSteps] = useState([]);
  // Sử dụng state bên MyOrder truyền vào
  const location = useLocation();
  // Lấy ra thông tin đã order
  const { orderId } = location.state || [];

  // Tổng tiền của đơn hàng
  const { userId } = location.state || null;

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders detail", userId, orderId],
    queryFn: () => fetchOrdersByOrderId(userId, orderId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Popup
  const [isCancel, setIsCancel] = useState(false);
  // Progress của order
  useEffect(() => {
    if (orders) {
      orders.map((order) =>
        setSteps([
          {
            label: "Order confirmed",
            date: order?.updateConfirmedAt,
            completed:
              order?.status.toString().toLowerCase() === "confirmed" ||
              order?.status.toString().toLowerCase() === "shipping" ||
              order?.status.toString().toLowerCase() === "completed"
                ? true
                : false,
          },
          {
            label: "Shipping",
            date: order?.updateShippingAt,
            completed:
              order?.status.toString().toLowerCase() === "shipping" ||
              order?.status.toString().toLowerCase() === "completed"
                ? true
                : false,
          },
          {
            label: "Completed",
            date: order?.updateCompletedAt,
            completed:
              order?.status.toString().toLowerCase() === "completed"
                ? true
                : false,
          },
        ])
      );
    }
  }, [orders]);
  // if (orders) {
  //   steps = [
  //     {
  //       label: "Order confirmed",
  //       date: orders?.updateConfirmedAt,
  //       completed:
  //         orders?.status.toString().toLowerCase() === "confirmed" ||
  //         orders?.status.toString().toLowerCase() === "shipping" ||
  //         orders?.status.toString().toLowerCase() === "completed"
  //           ? true
  //           : false,
  //     },
  //     {
  //       label: "Shipping",
  //       date: orders?.updateShippingAt,
  //       completed:
  //         orders?.status.toString().toLowerCase() === "shipping" ||
  //         orders?.status.toString().toLowerCase() === "completed"
  //           ? true
  //           : false,
  //     },
  //     {
  //       label: "Completed",
  //       date: orders?.updateCompletedAt,
  //       completed:
  //         orders?.status.toString().toLowerCase() === "completed"
  //           ? true
  //           : false,
  //     },
  //   ];
  // }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Hàm xử lí cancel đơn hàng
  const handleCancelOrder = async (orders) => {
    setLoadding(true);
    const user = await auth.currentUser;
    if (user) {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let currDay = `${day}/${month}/${year} ${hour}:${minute}`;

      const orderRef = doc(db, "Orders", orders.orderId);
      // Collection all orders update lại status của order nếu bị cancel
      const allOrdersRef = doc(db, "AllOrders", orders.orderId);
      if (orderRef) {
        // Update trạng thái đơn hàng của user
        await updateDoc(orderRef, {
          cancelAt: currDay,
          status: "Cancel",
        });
        setLoadding(false);
        navigate("/orders/purchase/status=canceled");
      }
      if (allOrdersRef) {
        // Update trạng thái orders nếu bị cancel
        await updateDoc(allOrdersRef, {
          deletedAt: currDay,
          status: "Cancel",
        });
      }
    }
  };

  return (
    <div className="bg-white">
      <Nav />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="lg:px-[100px] px-[20px] mb-[200px]">
          <>
            {isCancel && (
              <div className="overlay">
                <div className=" w-[500px]  bg-white rounded-lg p-7 flex flex-col justify-between">
                  <div className="">
                    <h3 className="lg:text-[27px] font-normal text-red-500">
                      Are you sure want to cancel order?
                    </h3>
                    <p className="text-[17px] text-gray-400 font-normal mt-5">
                      If you confirm this action cannot be undone and your
                      orders will be cancel.
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-4 mt-20">
                    <button
                      className="px-4 py-2 bg-red-500 rounded flex items-center justify-center text-white font-medium text-[15px] outline-none"
                      onClick={() => handleCancelOrder(orders)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-8 py-2 bg-[#e0e0e3] rounded flex items-center justify-center text-gray-400 font-medium text-[15px] outline-none"
                      onClick={() => setIsCancel(false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            <>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                  Profile
                </span>
                <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                  /
                </span>
                <span className="text-black text-[14px] font-normal  leading-[21px]">
                  My Orders
                </span>
                <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                  /
                </span>
                <span className="text-black text-[14px] font-normal  leading-[21px]">
                  Orders
                </span>
              </div>
              {orders.length > 0
                ? orders.map((order) => {
                    return (
                      <>
                        <div className="py-[40px] flex items-center gap-2 font-semibold px-1 text-[#801415] text-[18px]">
                          <span>Order ID:</span>
                          <span>{order.orderId}</span>
                        </div>
                        <div className="grid grid-cols-5 gap-10 pb-36">
                          <div className="col-span-3">
                            <span className="text-[20px] font-medium leading-[24px]">
                              Items Ordered & Delivery Details
                            </span>
                            <div className="py-[40px] flex items-center justify-center">
                              <OrderProgress steps={steps} />
                            </div>
                            <div className="flex flex-col gap-7">
                              <div className="flex flex-col border-2 border-gay-200 rounded-xl">
                                {order.products.map((product) => (
                                  <div
                                    key={product.id}
                                    className="flex justify-between p-5 hover:cursor-pointer"
                                    onClick={() =>
                                      navigate(
                                        `/dp/${product.name}/${product.productId}`
                                      )
                                    }
                                  >
                                    <div className="flex items-start gap-4">
                                      <LazyLoadImage
                                        src={product.image}
                                        alt={product.name}
                                        effect="blur"
                                        className="size-[80px] object-contain"
                                      />

                                      <div className="flex flex-col gap-3">
                                        <span className="text-[18px] font-medium">
                                          {product.name}
                                        </span>
                                        <div className="flex items-center gap-2 text-gray-500 text-[14px]">
                                          <span>Type:</span>
                                          <span>{product.color}</span>
                                          <span>|</span>
                                          <span>Quantity:</span>
                                          <span>{product.quantity}</span>
                                          <span>|</span>
                                          <span>Price:</span>
                                          <span>${product.price}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[14px]  text-gray-500">
                                          <span>Total:</span>
                                          <span className="text-red-500 font-medium text-[17px]">
                                            $
                                            {Math.round(
                                              product.price *
                                                product.quantity *
                                                100
                                            ) / 100}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <button
                                  className={`py-3 flex border-t-2 items-center justify-center text-red-700 font-medium text-[16px] leading-[24px] ${
                                    order.status.toString().toLowerCase() ===
                                      "shipping" ||
                                    order.status.toString().toLowerCase() ===
                                      "completed"
                                      ? "hidden"
                                      : "flex"
                                  }`}
                                  onClick={() => setIsCancel(true)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium text-[20px] leading-[24px]">
                              Payment Details
                            </span>
                            <div className="bg-[#f9ebe7] rounded-xl p-8 flex flex-col gap-4 mt-4">
                              {order.products.map((product) => (
                                <div
                                  key={product.id}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-4 font-medium">
                                    <span>{product.name}</span>
                                    <span>x{product.quantity}</span>
                                  </div>
                                  <span className="font-medium">
                                    $
                                    {Math.round(
                                      product.price * product.quantity * 100
                                    ) / 100}
                                  </span>
                                </div>
                              ))}
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Shipping</span>
                                <span className="font-medium">Free</span>
                              </div>
                              <div className="h-[2px] border-dashed border-2 border-gray-300"></div>
                              <div className="flex items-center justify-between text-[18px]">
                                <span className="font-medium">Total</span>
                                <span className="font-semibold text-red-500">
                                  ${Math.round(order.total * 100) / 100}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })
                : "Ccc"}
            </>
          </>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default OrderDetails;
