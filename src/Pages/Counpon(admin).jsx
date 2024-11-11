import SideBar from "../components/SideBar";
import { Loading } from "../components/Loading";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { addCoupon, fetchCoupon } from "../FetchAPI/FetchAPI";
const Coupon = () => {
  const [clickAddCoupon, setClickAddCoupon] = useState(false);
  const [code, setCode] = useState("");
  const [des, setDes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [endDate, setEndDate] = useState("");
  const getDate = () => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleCreateCoupon = async () => {
    if (code && des && discount && freeDelivery && quantity && endDate) {
      const fomatDate = endDate.split("-").reverse().join("/");
      const cp = {
        code: code,
        des: des,
        discount: discount,
        free_delivery: freeDelivery,
        createdAt: getDate(),
        quantity: quantity,
        endDate: fomatDate,
      };
      await addCoupon(cp);
    } else {
      console.log("False!");
    }
  };
  const cp = [
    {
      code: "ZERODAY",
      des: "Zero day counpon",
      discount: 10,
      free_delivery: false,
      createdAt: getDate(),
      quantity: 5,
      endDate: getDate(),
    },
    {
      code: "BLACKFRIDAY",
      des: "Black friday",
      discount: 20,
      free_delivery: true,
      createdAt: getDate(),
      quantity: 10,
      endDate: getDate(),
    },
    {
      code: "KDAOM",
      des: "Discount some product",
      discount: 5,
      free_delivery: false,
      createdAt: getDate(),
      quantity: 20,
      endDate: getDate(),
    },
  ];
  return (
    <div className="grid grid-cols-6">
      {clickAddCoupon ? (
        <div className="overlay">
          <div className="bg-white rounded-md   relative">
            <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <span className="font-medium text-[18px]">Add Coupon</span>
              <XMarkIcon
                className="size-[23px] absolute right-[24px] top-[15px] hover:cursor-pointer"
                onClick={() => setClickAddCoupon(false)}
              />
            </div>
            <div className="flex items-start justify-center flex-col gap-6 px-12  py-5 text-[15px]">
              <div className="flex items-start justify-between  gap-10">
                <label
                  htmlFor="cpcode"
                  className="font-medium min-w-[120px]"
                >
                  Coupon Code
                </label>
                <input
                  type="text"
                  id="cpcode"
                  className="py-1 px-2 rounded-md border-2 border-gray-200"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <div className="flex items-start  gap-10">
                <label
                  htmlFor="des"
                  className="font-medium min-w-[120px]"
                >
                  Description
                </label>
                <textarea
                  type="text"
                  id="des"
                  className="py-1 px-2 rounded-md border-2 border-gray-200 max-h-[100px] min-h-[80px]"
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                />
              </div>
              <div className="flex items-start  gap-10">
                <label
                  htmlFor="dis"
                  className="font-medium min-w-[120px]"
                >
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="dis"
                  className="py-1 px-2 rounded-md border-2 border-gray-200"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="flex items-start  gap-10">
                <label
                  htmlFor="dis"
                  className="font-medium min-w-[120px]"
                >
                  Free Delivery
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fd"
                    id="yes"
                    value={true}
                    onChange={(e) => setFreeDelivery(e.target.value)}
                  />
                  <label htmlFor="yes">Yes</label>
                  <input
                    type="radio"
                    name="fd"
                    id="no"
                    value={false}
                    onChange={(e) => setFreeDelivery(e.target.value)}
                  />
                  <label htmlFor="no">No</label>
                </div>
              </div>
              <div className="flex items-start  gap-10">
                <label
                  htmlFor="qt"
                  className="font-medium min-w-[120px]"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="qt"
                  className="py-1 px-2 rounded-md border-2 border-gray-200"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="flex items-start  gap-10">
                <label
                  htmlFor="ed"
                  className="font-medium min-w-[120px]"
                >
                  Redeem Before
                </label>
                <input
                  type="date"
                  id="ed"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="py-1 px-2 rounded-md border-2 border-gray-200"
                />
              </div>
              <div className="flex items-start mt-4 justify-end w-full">
                <button
                  className="px-8 py-2 text-[14px] bg-[#0077ed] rounded-md text-white font-medium transition-all duration-300 hover:scale-105"
                  onClick={() => handleCreateCoupon()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <SideBar isActive={"coupon"} />
      {/* {loading || isLoading ? (
        <div className="col-span-5">
          <Loading />
        </div>
      ) : ( */}
      <div className={`bg-[#f0f1f3] px-[50px] py-5 col-span-5 `}>
        <h2 className="text-[25px] font-semibold">Coupon</h2>
        <div className=" py-[50px]">
          <div className="flex items-center justify-end my-4">
            <button
              className="px-6 font-medium py-2 hover:scale-105 transition-all duration-300 rounded-md bg-[#0077ed] text-white text-[14px]"
              onClick={() => setClickAddCoupon(true)}
            >
              Add Coupon
            </button>
          </div>
          <div className="bg-[#ffffff] rounded-lg py-5 px-3 w-full">
            <table
              className="w-full"
              style={{ padding: "20px" }}
            >
              <thead className="text-[#667085]">
                <tr className="text-[15px] font-medium">
                  <td className="px-5 py-3 rounded-tl-lg rounded-bl-lg">
                    Name
                  </td>
                  <td className="px-5 py-3">Description</td>
                  <td className="px-5 py-3">Discount</td>
                  <td className="px-5 py-3">Free Delivery</td>
                  <td className="px-5 py-3">Quantity</td>
                  <td className="px-5 py-3">Created At</td>
                  <td className="px-5 py-3 rounded-tr-lg rounded-br-lg">
                    EndDate
                  </td>
                </tr>
              </thead>
              <tbody>
                {cp
                  ? cp.map((customer) => {
                      return (
                        <tr
                          className="text-[14px] border-b-2 border-[#f5f5f5] font-medium"
                          key={customer.code}
                        >
                          <td className="px-5 py-5">{customer.code}</td>
                          <td className="px-5 py-5">{customer.des}</td>
                          <td className="px-5 py-5">{customer.discount}</td>
                          <td className="px-5 py-5">
                            {customer.free_delivery ? "Yes" : "No"}
                          </td>
                          <td className="px-5 py-5">{customer.quantity}</td>
                          <td className="px-5 py-5">{customer.createdAt}</td>

                          <td className="px-5 py-5 text-red-500">
                            {customer.endDate}
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
      {/* )} */}
    </div>
  );
};

export default Coupon;
