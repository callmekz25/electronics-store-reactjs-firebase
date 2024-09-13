// Hero icon
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { TagIcon } from "@heroicons/react/24/outline";
// Firebase
import { auth } from "../firebase";
// Hook
import { memo } from "react";
import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../Context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { fetchCartsByUser } from "../FetchAPI/FetchAPI";
import { toast } from "react-toastify";

const Nav = ({ hidden }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [isActiveMenu, setIsActiveMenu] = useState(false);
  // Context lấy ra thông tin user sau khi đăng nhập
  const { user, loading } = useContext(UserContext);
  const { data, isLoading } = useQuery({
    queryKey: ["carts", user?.userId],
    queryFn: () => fetchCartsByUser(user),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Chuyển trang nav
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveItem("home");
    } else if (path === "/contact") {
      setActiveItem("contact");
    } else if (path === "/about") {
      setActiveItem("about");
    } else if (path === "/sign-up") {
      setActiveItem("signup");
    }
  }, [location.pathname]);
  // Hàm xử kiểm tra user có log in chưa nếu chưa thì chuyển đăng nhập ngược lại thì chuyển vô carts của user
  const handleCart = () => {
    if (!user && !isLoading && !loading) {
      navigate("/log-in");
    } else {
      navigate("/carts");
    }
  };
  const handleProfile = () => {
    if (!user && !isLoading && !loading) {
      navigate("/log-in");
      setActive(false);
    } else {
      setActive(!active);
    }
  };

  // Hàm xử lí đăng xuất account
  const handleLogOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      navigate("/log-in");
    } catch (e) {
      toast.error(`Fail to log out!`, {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };
  useEffect(() => {
    if (isActiveMenu) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [isActiveMenu]);

  return (
    <div className="px-[20px] lg:px-0">
      <div className="lg:py-[40px] py-[20px]">
        <div className="flex items-center justify-between ">
          <Link
            to="/"
            className="lg:text-[24px] text-[24px] font-bold leading-[24px]"
          >
            Exclusive
          </Link>
          <ul className="lg:flex hidden items-center gap-[50px] text-[16px] font-normal leading-[24px]">
            <li
              className={`hover:opacity-50 transition-all duration-200 ${
                activeItem === "home" ? "border-b-2 border-black" : ""
              }`}
              onClick={() => setActiveItem("home")}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              className={`hover:opacity-50 transition-all duration-200 ${
                activeItem === "contact" ? "border-b-2 border-black" : ""
              }`}
              onClick={() => setActiveItem("contact")}
            >
              <Link to="/contact">Contact</Link>
            </li>
            <li
              className={`hover:opacity-50 transition-all duration-200 ${
                activeItem === "about" ? "border-b-2 border-black" : ""
              }`}
              onClick={() => setActiveItem("about")}
            >
              <Link to="/about">About</Link>
            </li>
            {!user && (
              <li
                className={`hover:opacity-50 transition-all duration-200 ${
                  activeItem === "signup" ? "border-b-2 border-black" : ""
                }`}
                onClick={() => setActiveItem("signup")}
              >
                <Link to="/sign-up">Sign Up</Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-6">
            <div className="relative lg:block hidden">
              <input
                type="text"
                name="search"
                id="search"
                className="pl-[20px] pr-[50px] py-2 placeholder:text-[12px] placeholder:font-normal placeholder:leading-[18px]  outline-none bg-[#e9e8e8] rounded text-[13px]"
                placeholder="What are you looking for?"
              />
              <button className="size-[20px] absolute right-[12px] top-[50%] translate-y-[-50%]">
                <MagnifyingGlassIcon />
              </button>
            </div>
            <>
              <div className="relative ">
                <ShoppingCartIcon
                  className={`size-[27px] ${hidden} hover:cursor-pointer`}
                  onClick={() => handleCart()}
                />

                <div
                  className={`absolute top-[-10px] right-[-10px] bg-black rounded-full size-[20px] flex items-center justify-center text-white text-[14px] ${
                    !isLoading && data && !loading && user ? "flex" : "hidden"
                  } ${hidden}`}
                >
                  {!data ? 0 : data.length}
                </div>
              </div>
            </>

            <button
              className={`flex items-center justify-center relative profile ${hidden}`}
              onClick={() => handleProfile()}
            >
              <UserIcon className="size-[27px]" />
              <ul
                className={`absolute top-[40px] right-0  z-[100] p-[18px] flex flex-col gap-4 w-[240px] drop-down-profile ${
                  active ? "flex" : "hidden"
                }`}
              >
                <li className="group">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2"
                  >
                    <UserIcon className="size-[30px]" />
                    <span className="text-[14px] font-normal leading-[21px] ">
                      My Account
                    </span>
                  </Link>
                </li>
                <li className="group">
                  <Link
                    to="/orders/purchase/status=all"
                    className="flex items-center gap-2 group"
                  >
                    <TagIcon className="size-[30px]" />
                    <span className="text-[14px] font-normal leading-[21px] ">
                      My Orders
                    </span>
                  </Link>
                </li>
                <li className="group">
                  <button
                    className="flex items-center gap-2"
                    onClick={handleLogOut}
                  >
                    <ArrowLeftStartOnRectangleIcon className="size-[30px]" />
                    <span className="text-[14px] font-normal leading-[21px] ">
                      Log out
                    </span>
                  </button>
                </li>
              </ul>
            </button>
            <div
              className="flex flex-col items-center justify-center gap-2 lg:hidden hover:cursor-pointer transition-all duration-300 z-[1000]"
              onClick={() => setIsActiveMenu(!isActiveMenu)}
            >
              <div
                className={`w-6 h-[2px] bg-black rounded-full transition-all duration-300 ${
                  isActiveMenu
                    ? "  rotate-[-45deg] translate-x-[-5px] translate-y-[4px]"
                    : ""
                }`}
              ></div>
              <div
                className={`w-6 h-[2px] bg-black rounded-full transition-all duration-300 ${
                  isActiveMenu
                    ? "  rotate-[45deg] translate-x-[-5px] translate-y-[-6px]"
                    : ""
                }`}
              ></div>
            </div>
            <div
              className={`${
                isActiveMenu ? "burger-menu" : "burger-menu hidden"
              }`}
            >
              <div className={`${isActiveMenu ? "menu open" : "menu"}`}>
                <ul
                  className={`${
                    isActiveMenu
                      ? "flex flex-col gap-4 text-[26px] font-medium"
                      : "hidden"
                  }`}
                >
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li onClick={() => setIsActiveMenu(false)}>
                    <Link to="/sign-up">Sign Up</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="relative block lg:hidden mt-6">
          <input
            type="text"
            name="search"
            id="searchMobile"
            className="pl-[20px] pr-[50px] py-3 placeholder:text-[15px] placeholder:font-normal placeholder:leading-[18px] placeholder:opacity-50 outline-none bg-[#f5f5f5] rounded text-[16px] w-full"
            placeholder="What are you looking for?"
          />
          <MagnifyingGlassIcon className="size-[26px] absolute right-[12px] top-[50%] translate-y-[-50%]" />
        </div>
      </div>
    </div>
  );
};
export default memo(Nav);
