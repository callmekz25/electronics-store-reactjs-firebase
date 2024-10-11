import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { db } from "../firebase";
import { doc, updateDoc, getDoc, increment, setDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
// Icon

import {
  ListBulletIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Loading } from "../components/Loading";
import { toast, ToastContainer } from "react-toastify";
import { fetchAllOrders } from "../FetchAPI/FetchAPI";
import { Error } from "./Error";
import { UserContext } from "../Context/UserContext";
import { Pagination } from "../components/Pagination";
const OrdersList = () => {
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalCancel, setTotalCancel] = useState(null);
  const [totalShipping, setTotalShipping] = useState(null);
  const [totalOrdersToday, setTotalOrdersToday] = useState(null);
  const [isUpdateStatus, setIsUpdateStatus] = useState(false);
  const [status, setStatus] = useState(null);
  const [orderUpdate, setOrderUpdate] = useState(null);
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [perOfPage, setPerOfPage] = useState(10);
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchAllOrders(user),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // useEffect(() => {
  //   let date = new Date();
  //   let day = date.getDate();
  //   let month = date.getMonth() + 1;
  //   let year = date.getFullYear();
  //   let currentDate = `${day}/${month}/${year}`;
  //   if (orders) {
  //     setTotalOrders(orders.length);
  //     orders.map((order) => {
  //       if (order.status === "Cancel") {
  //         setTotalCancel((prev) => prev + 1);
  //       }
  //       if (order.status === "Shipping") {
  //         setTotalShipping((prev) => prev + 1);
  //       }
  //       if (order.date === currentDate) {
  //         setTotalOrdersToday((prev) => prev + 1);
  //       }
  //     });
  //   }
  // }, [orders]);
  // Hàm up database số lần product được mua và completed
  const handleBestSelling = async (product) => {
    for (const p of product) {
      const bestSellingRef = doc(db, "All-products", p.productId);
      const bestSellingGet = await getDoc(bestSellingRef);
      if (bestSellingGet.exists()) {
        try {
          await updateDoc(bestSellingRef, {
            quantitySold: increment(1),
          });
        } catch (e) {
          toast.error("Fail to update database!", {
            position: "top-center",
            autoClose: 1500,
          });
        }
      }
    }
  };
  // Hàm xử lí phần update trạng thái của đơn hàng
  const handleUpdateStatus = async (data) => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let currDay = `${day}.${month}.${year} ${hour}:${minute}`;

    const orderRef = doc(db, "Orders", data.orderId);
    const allOrderRef = doc(db, "AllOrders", data.orderId);
    if (status.toString().toLowerCase() === "confirmed") {
      await updateDoc(orderRef, {
        updateConfirmedAt: currDay,
        status: status,
      });
      await updateDoc(allOrderRef, {
        updateConfirmedAt: currDay,
        status: status,
      });
    }
    if (status.toString().toLowerCase() === "shipping") {
      await updateDoc(orderRef, {
        updateShippingAt: currDay,
        status: status,
      });
      await updateDoc(allOrderRef, {
        updateShippingAt: currDay,
        status: status,
      });
    }
    if (status.toString().toLowerCase() === "completed") {
      await updateDoc(orderRef, {
        updateCompletedAt: currDay,
        status: status,
      });
      await updateDoc(allOrderRef, {
        updateCompletedAt: currDay,
        status: status,
      });
      await handleBestSelling(data.products);
    }
    if (updateDoc) {
      toast.success(`Update status's order successfully!`, {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const lastIndex = currentPage * perOfPage;
  const firstIndex = lastIndex - perOfPage;
  const currentList = orders.slice(firstIndex, lastIndex);
  console.log(currentList);

  if (isLoading && loading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }
  return (
    <div className={`grid grid-cols-6 `}>
      {/* Delete product popup */}
      {isUpdateStatus && (
        <div className="overlay">
          <div className=" w-[500px] h-[300px] bg-white rounded-lg p-7 flex flex-col justify-between relative">
            <XMarkIcon
              className="absolute right-2 size-[28px] top-2 hover:cursor-pointer"
              onClick={() => setIsUpdateStatus(false)}
            />
            <div className="">
              <h3 className="text-[25px] font-medium text-center">
                Update status order
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-[#fffadd] text-[15px] font-medium text-[#efe22b] flex items-center justify-center py-1 px-5 rounded-md hover:cursor-pointer hover:scale-110 transition-all duration-300"
                onClick={() => setStatus("Confirmed")}
              >
                Confirm
              </button>
              <button
                className="bg-[#ffeddd] text-[15px] font-medium text-[#f99b43] flex items-center justify-center py-1 px-5 rounded-md  hover:cursor-pointer hover:scale-110 transition-all duration-300"
                onClick={() => setStatus("Shipping")}
              >
                Shipping
              </button>
              <button
                className="bg-[#e8ffdd] text-[15px] font-medium text-[#67f943] flex items-center justify-center py-1 px-5 rounded-md  hover:cursor-pointer hover:scale-110 transition-all duration-300"
                onClick={() => setStatus("Completed")}
              >
                Completed
              </button>
            </div>
            <div className="flex items-center justify-end gap-4">
              <button
                className="px-4 py-2 bg-red-500 rounded flex items-center justify-center text-white font-medium text-[15px] outline-none"
                onClick={() => handleUpdateStatus(orderUpdate)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      <SideBar isActive={"orders"} />
      <div className={`bg-[#f0f1f3]   px-[50px] py-5 col-span-5`}>
        <div className="py-7">
          <div className="bg-[#ffffff] rounded-lg py-5 px-6">
            <h2 className="font-medium text-[20px]">Overall Orders</h2>
            <div className="grid grid-cols-5">
              <div className="flex flex-col justify-center gap-2 border-r-2 border-gray-300  py-3">
                <div className="flex flex-col gap-4 font-medium">
                  <span className="text-[15px] text-[#2278f0]">
                    Total orders
                  </span>
                  <span className=" text-[20px]">{totalOrdersToday || 0}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2 border-r-2 border-gray-300  px-10">
                <div className="flex flex-col gap-4 font-medium">
                  <span className="text-[15px] text-[#e19133]">
                    Total Received
                  </span>
                  <span className=" text-[20px] ">{totalOrders || 0}</span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2 border-r-2 border-gray-300 px-10">
                <div className="flex flex-col gap-4 font-medium">
                  <span className="text-[15px] text-[#8e65cb]">
                    Total Returned
                  </span>
                  <span className="font-semibold text-[20px]">20</span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2 border-r-2 border-gray-300 px-10 ">
                <div className="flex flex-col gap-4 font-medium">
                  <span className="text-[15px] text-[#30c07d] ">
                    On the way
                  </span>
                  <span className="font-semibold text-[20px]">
                    {totalShipping || 0}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-2  px-10">
                <div className="flex flex-col gap-4 font-medium">
                  <span className="text-[15px] text-[#f36960] ">
                    Total Cancelled
                  </span>
                  <span className="font-semibold text-[20px]">
                    {totalCancel || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" py-[50px]">
          <div className=" bg-[#ffffff] rounded-lg py-5 px-3 w-full">
            <table
              className="w-full"
              style={{ padding: "20px" }}
            >
              <thead className="text-[#667085]">
                <tr className="text-[15px] font-medium">
                  <td className="py-3  px-5">Order ID</td>
                  <td className="py-3 px-5">Customer</td>
                  <td className="py-3 px-5">Date</td>
                  <td className="py-3 px-5">Quantity</td>
                  <td className="py-3 px-5">Revenue</td>
                  <td className="py-3 px-5">Status</td>
                  <td className="py-3 px-5">Actions</td>
                </tr>
              </thead>
              <tbody>
                {orders
                  ? orders.map((order) => {
                      return (
                        <tr
                          className="text-[14px] border-b-2 border-[#f5f5f5] font-medium "
                          key={order.orderId}
                        >
                          <td className="py-5 px-5 w-[300px]">
                            {order.orderId}
                          </td>
                          <td className="px-5 py-5">{order.name}</td>
                          <td className="px-5 py-5">
                            {order.createdAt.split(" ")[0]}
                          </td>
                          <td className="px-5 py-5">{order.products.length}</td>
                          <td className=" py-5 px-5">
                            ${Math.round(order.total * 100) / 100}
                          </td>
                          <td className="py-5 px-5">
                            <span
                              className={` text-[13px] font-semibold ${
                                order.status === "Shipping"
                                  ? "text-[#f99b43]"
                                  : ""
                              } ${
                                order.status === "Cancel"
                                  ? " text-[#f14c3c]"
                                  : ""
                              } ${
                                order.status === "Completed"
                                  ? " text-[#12b76a]"
                                  : ""
                              } ${
                                order.status === "Pending"
                                  ? " text-[#aa19bd]"
                                  : ""
                              } ${
                                order.status === "Confirmed"
                                  ? " text-[#1366d9]"
                                  : ""
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-8 flex gap-4 items-center">
                            <PencilSquareIcon
                              className="size-[23px] text-gray-400 hover:cursor-pointer"
                              onClick={() => {
                                setOrderUpdate(order);
                                setIsUpdateStatus(true);
                              }}
                            />
                            <ListBulletIcon
                              className="size-[23px] text-gray-400 hover:cursor-pointer"
                              onClick={() => {
                                navigate(
                                  `/admin/orders/user=/${order.userId}`,
                                  {
                                    state: {
                                      ordersUser: order,
                                    },
                                  }
                                );
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })
                  : "Customers is empty"}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default OrdersList;
