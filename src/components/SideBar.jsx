import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  UsersIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
const SideBar = ({ isActive }) => {
  const navigate = useNavigate();
  const [clickProduct, setClickProduct] = useState(false);

  return (
    <>
      <div
        className={`p-7 flex flex-col bg-[#ffffff] text-white gap-10  col-span-1 min-h-[1000px]`}
      >
        <h2 className="text-[30px] font-semibold text-black">Exclusive</h2>
        <ul className="flex flex-col gap-4 text-[#9c9ea7]">
          <li
            className={`p-2  rounded-lg flex items-center gap-4 hover:cursor-pointer ${
              isActive === "home" ? "text-[#2278f0]" : ""
            }`}
            onClick={() => {
              navigate("/admin");
            }}
          >
            <HomeIcon
              className={`size-[20px] ${
                isActive === "home" ? "text-[#2278f0]" : ""
              }`}
            />
            <span className="text-[15px] leading-[24px] pt-1 font-medium">
              Home
            </span>
          </li>
          <li
            className={`p-2  rounded-lg flex items-center gap-4 hover:cursor-pointer ${
              isActive === "customers" ? "text-[#2278f0]" : ""
            }`}
            onClick={() => {
              navigate("/admin/customers");
            }}
          >
            <UsersIcon
              className={`size-[20px] ${
                isActive === "customers" ? "text-[#2278f0]" : ""
              }`}
            />
            <span className="text-[15px] leading-[24px] pt-1 font-medium">
              Customers
            </span>
          </li>
          <li
            className={`p-2  rounded-lg flex items-center gap-4 hover:cursor-pointer ${
              isActive === "orders" ? "text-[#2278f0]" : ""
            }`}
            onClick={() => {
              navigate("/admin/orders");
            }}
          >
            <CubeIcon
              className={`size-[20px] ${
                isActive === "orders" ? "text-[#2278f0]" : ""
              }`}
            />
            <span className="text-[15px] leading-[24px] pt-1 font-medium">
              Orders
            </span>
          </li>
          <li
            className={`p-2  rounded-lg relative flex items-center gap-4 hover:cursor-pointer 
            }`}
            onClick={() => {
              setClickProduct(!clickProduct);
            }}
          >
            <TagIcon
              className={`size-[20px]  ${
                clickProduct || isActive === "add" || isActive === "stock"
                  ? "text-[#2278f0]"
                  : ""
              }`}
            />
            <div className="flex items-center gap-2">
              <span
                className={`text-[15px] leading-[24px]  font-medium ${
                  clickProduct || isActive === "add" || isActive === "stock"
                    ? "text-[#2278f0]"
                    : ""
                }`}
              >
                Products
              </span>
              <ChevronDownIcon
                className={`size-4 transition-all duration-300 ${
                  clickProduct ? " rotate-180 text-[#2278f0]" : ""
                } ${
                  isActive === "add" || isActive === "stock"
                    ? "text-[#2278f0]"
                    : ""
                }`}
              />
            </div>
            <div
              className={`flex flex-col gap-2 absolute top-10 left-14  overflow-hidden ${
                clickProduct ? "h-auto" : "h-0"
              }`}
            >
              <div>
                <span
                  className={`text-[13px] leading-[24px] hover:text-[#2278f0] font-medium  transition-all duration-200 ${
                    clickProduct ? "opacity-100" : "opacity-0"
                  } ${isActive === "add" ? "text-[#2278f0]" : ""}`}
                  onClick={() => {
                    navigate("/admin/add");
                  }}
                >
                  Add new product
                </span>
              </div>
              <div>
                <span
                  className={`text-[13px] leading-[24px] hover:text-[#2278f0]  font-medium  transition-all duration-200  ${
                    clickProduct ? "opacity-100" : "opacity-0"
                  } ${isActive === "stock" ? "text-[#2278f0]" : ""}`}
                  onClick={() => {
                    navigate("/admin/products");
                  }}
                >
                  Stock
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};
export default SideBar;
