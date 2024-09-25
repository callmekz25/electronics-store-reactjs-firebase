import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { useNavigate } from "react-router-dom";
const SideBar = ({ isActive }) => {
  const navigate = useNavigate();

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
            className={`p-2  rounded-lg flex items-center gap-4 hover:cursor-pointer ${
              isActive === "products" ? "text-[#2278f0]" : ""
            }`}
            onClick={() => {
              navigate("/admin/products");
            }}
          >
            <TagIcon
              className={`size-[20px]  ${
                isActive === "products" ? "text-[#2278f0]" : ""
              }`}
            />
            <span className="text-[15px] leading-[24px] pt-1 font-medium">
              Products
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};
export default SideBar;
