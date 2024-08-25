import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Thum from "../Assets/Auth/image.webp";
import { EyeIcon } from "@heroicons/react/24/solid";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
    signInWithEmailAndPassword,
    sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { UserContext } from "../Context/UserContext";
import { Error } from "./Error";
const LogIn = () => {
    const { setUser, loading } = useContext(UserContext);
    const [loadingChange, setLoadingChange] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmailMessage, setErrorEmailMessage] = useState("");
    const [errorPasswordMessage, setErrorPasswordMessage] = useState("");
    const handleLogIn = async (e) => {
        e.preventDefault();
        if (!email) {
            setErrorEmailMessage("Your email cannot empty");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorEmailMessage("Please enter a valid email");
        }
        if (!password) {
            setErrorPasswordMessage("Your password cannot empty");
        }
        if (
            email &&
            password &&
            errorEmailMessage === "" &&
            errorPasswordMessage === ""
        ) {
            try {
                const userAuth = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const user = userAuth.user;
                // Kiểm tra người dùng đã xác thực email chưa mới log in không thì gửi xác thực lại
                if (user.emailVerified) {
                    toast.success("Login Successfully!");
                    setLoadingChange(true);
                    // Dùng context update lại user sau khi login để không bị không cập nhật user ngay lập tức

                    setUser(user);
                    setTimeout(() => {
                        navigate("/");
                        setLoadingChange(false);
                    }, 1000);
                } else {
                    sendEmailVerification(user);
                    toast("Please verify your email to log in!");
                }
            } catch (e) {
                return <Error />;
            }
        }
    };

    return (
        <>
            {loading || loadingChange ? (
                <Loading />
            ) : (
                <>
                    <Nav hidden="hidden" />
                    <div className=" grid grid-cols-2 gap-[130px] ">
                        <div className="">
                            <img
                                src={Thum}
                                alt=""
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="flex justify-center flex-col py-[180px]">
                            <h1 className="lg:text-[36px] font-bold lg:leading-[30px] ">
                                Log in to Exclusive
                            </h1>
                            <span className="text-[16px] font-normal leading-[24px] mt-[24px]">
                                Enter your details below
                            </span>
                            <form
                                action=""
                                onSubmit={handleLogIn}
                                className="flex flex-col  pt-[48px] gap-[40px] w-[400px]"
                            >
                                <div className="relative">
                                    <label
                                        htmlFor="email"
                                        className="text-[#999999] text-[16px] font-normal"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        id="email"
                                        name="email"
                                        className={`mt-2 outline-none border-2 border-[gray-500] rounded-md py-2 px-4  text-[16px] leading-[24px] font-normal  w-full  ${
                                            errorEmailMessage
                                                ? "border-[#fc3939] bg-[#fff9f9]"
                                                : ""
                                        }`}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        onInput={() => setErrorEmailMessage("")}
                                    />
                                    <span className="absolute bottom-[-30%] left-0 text-[14px] text-[#fc3939] font-medium">
                                        {errorEmailMessage}
                                    </span>
                                </div>
                                <div className="relative">
                                    <label
                                        htmlFor="email"
                                        className="text-[#999999] text-[16px] font-normal"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type={`${
                                            showPass ? "text" : "password"
                                        }`}
                                        className={`mt-2 outline-none border-2 border-[gray-500] rounded-md py-2 px-4  text-[16px] leading-[24px] font-normal  w-full  ${
                                            errorPasswordMessage
                                                ? "border-[#fc3939] bg-[#fff9f9]"
                                                : ""
                                        }`}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        onInput={() =>
                                            setErrorPasswordMessage("")
                                        }
                                    />
                                    <EyeSlashIcon
                                        className={`size-[20px] text-gray-500 absolute right-[5%] top-[50%] translate-y-[30%] hover:cursor-pointer ${
                                            showPass ? "hidden" : "block"
                                        }`}
                                        onClick={() => setShowPass(true)}
                                    />
                                    <EyeIcon
                                        className={`size-[20px] text-gray-500 absolute right-[5%] top-[50%] translate-y-[30%] hover:cursor-pointer ${
                                            showPass ? "block" : "hidden"
                                        }`}
                                        onClick={() => setShowPass(false)}
                                    />
                                    <span className="absolute bottom-[-30%] left-0 text-[14px] text-[#fc3939] font-medium">
                                        {errorPasswordMessage}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        className="flex items-center justify-center bg-[#DB4444] py-4 rounded text-white text-[16px] font-medium leading-[24px] px-[48px]"
                                        type="submit"
                                    >
                                        Log In
                                    </button>
                                    <Link
                                        to="/"
                                        className="text-[#DB4444] text-[16px] font-normal leading-[24px]"
                                    >
                                        Forget Password?
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                    <Footer />
                    <ToastContainer />
                </>
            )}
        </>
    );
};
export default LogIn;
