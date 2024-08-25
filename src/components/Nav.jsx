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
import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { UserContext } from "../Context/UserContext";

const Nav = ({ hidden }) => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState("");
    const [active, setActive] = useState(false);
    const navigate = useNavigate();
    const { totalUniqueItems } = useCart();
    // Context lấy ra thông tin user sau khi đăng nhập
    const { user } = useContext(UserContext);
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
    const handleCart = (e) => {
        e.preventDefault();
        if (!user) {
            navigate("/sign-up");
        } else {
            navigate("/carts");
        }
    };

    // Hàm xử lí đăng xuất account
    const handleLogOut = async () => {
        try {
            await auth.signOut();
            navigate("/sign-up");
        } catch (e) {
            console.log("Error log out: ", e.message);
        }
    };
    return (
        <>
            <div className="py-[40px] px-[135px] flex items-center justify-between border-b border-[gray-500]">
                <div className="">
                    <span className="text-[24px] font-bold leading-[24px]">
                        Exclusive
                    </span>
                </div>
                <ul className="flex items-center gap-[50px] text-[16px] font-normal leading-[24px]">
                    <li
                        className={`hover:opacity-50 transition-all duration-200 ${
                            activeItem === "home"
                                ? "border-b-2 border-black"
                                : ""
                        }`}
                        onClick={() => setActiveItem("home")}
                    >
                        <Link to="/">Home</Link>
                    </li>
                    <li
                        className={`hover:opacity-50 transition-all duration-200 ${
                            activeItem === "contact"
                                ? "border-b-2 border-black"
                                : ""
                        }`}
                        onClick={() => setActiveItem("contact")}
                    >
                        <Link to="/contact">Contact</Link>
                    </li>
                    <li
                        className={`hover:opacity-50 transition-all duration-200 ${
                            activeItem === "about"
                                ? "border-b-2 border-black"
                                : ""
                        }`}
                        onClick={() => setActiveItem("about")}
                    >
                        <Link to="/about">About</Link>
                    </li>
                    {!user && (
                        <li
                            className={`hover:opacity-50 transition-all duration-200 ${
                                activeItem === "signup"
                                    ? "border-b-2 border-black"
                                    : ""
                            }`}
                            onClick={() => setActiveItem("signup")}
                        >
                            <Link to="/sign-up">Sign Up</Link>
                        </li>
                    )}
                </ul>

                <div className="flex items-center gap-[16px]">
                    <div className="relative">
                        <input
                            type="text"
                            name=""
                            id=""
                            className="pl-[20px] pr-[50px] py-2 placeholder:text-[12px] placeholder:font-normal placeholder:leading-[18px] placeholder:opacity-50 outline-none bg-[#f5f5f5] rounded text-[13px]"
                            placeholder="What are you looking for?"
                        />
                        <MagnifyingGlassIcon className="size-[24px] absolute right-[12px] top-[50%] translate-y-[-50%]" />
                    </div>
                    {user ? (
                        <>
                            <div className="relative">
                                <ShoppingCartIcon
                                    className={`size-[27px] ${hidden} hover:cursor-pointer`}
                                    onClick={handleCart}
                                />

                                <div
                                    className={`absolute top-[-10px] right-[-10px] bg-red-500 rounded-full size-[20px] flex items-center justify-center text-white text-[14px] `}
                                >
                                    {totalUniqueItems}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="relative">
                                <ShoppingCartIcon
                                    className={`size-[27px] ${hidden} hover:cursor-pointer`}
                                    onClick={handleCart}
                                />
                            </div>
                        </>
                    )}

                    <button
                        className={`flex items-center justify-center relative profile ${hidden}`}
                        onClick={() => {
                            if (user) {
                                setActive(!active);
                            } else {
                                setActive(false);
                                navigate("/sign-up");
                            }
                        }}
                    >
                        <UserIcon className="size-[27px] " />
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
                                    <span className="text-[14px] font-normal leading-[21px] group-hover:font-medium ">
                                        View my profile
                                    </span>
                                </Link>
                            </li>
                            <li className="group">
                                <button
                                    className="flex items-center gap-2"
                                    onClick={handleLogOut}
                                >
                                    <ArrowLeftStartOnRectangleIcon className="size-[30px]" />
                                    <span className="text-[14px] font-normal leading-[21px] group-hover:font-medium ">
                                        Log out
                                    </span>
                                </button>
                            </li>
                            <li className="group">
                                <Link
                                    to="/orders/purchase/status=all"
                                    className="flex items-center gap-2 group"
                                >
                                    <TagIcon className="size-[30px]" />
                                    <span className="text-[14px] font-normal leading-[21px] group-hover:font-medium ">
                                        My Orders
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </button>
                </div>
            </div>
        </>
    );
};
export default Nav;
