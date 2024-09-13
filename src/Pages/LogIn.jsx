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
        toast.error("Your account does not exist, please try or sign up!", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  };
  const handleBlurInput = (input) => {
    if (input.name === "email") {
      if (!input.value) {
        setErrorEmailMessage("Your email cannot empty!");
      } else {
        setErrorEmailMessage("");
      }
    }
    if (input.name === "password") {
      if (!input.value) {
        setErrorPasswordMessage("Your password cannot empty!");
      } else {
        setErrorPasswordMessage("");
      }
    }
  };
  return (
    <div className="lg:px-[135px] ">
      {loading || loadingChange ? (
        <Loading />
      ) : (
        <>
          <Nav hidden="hidden" />
          <div className="lg:py-[60px] py-[40px] px-[20px]">
            <h5
              className="lg:text-[40px] font-semibold leading-[44px] text-[30px]"
              data-aos="fade-in"
            >
              Sign in to pay faster.
            </h5>
            <div
              className="flex justify-center items-center flex-col py-[40px]"
              data-aos="fade-in"
            >
              <h1 className="lg:text-[30px] font-semibold lg:leading-[44px] text-[25px]">
                Sign in to Exclusive
              </h1>

              <form
                onSubmit={handleLogIn}
                className="flex flex-col  pt-[48px] gap-[40px] lg:w-[400px]"
              >
                <div className="relative">
                  <label
                    htmlFor="email"
                    className={`text-[#999999] text-[16px] font-normal ${
                      errorEmailMessage ? "text-[#fc3939]" : ""
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className={`mt-2 outline-none border-2  rounded-md lg:py-2 py-3 px-4  text-[16px] leading-[24px] font-normal  w-full focus:border-blue-500 focus:border-2 focus:bg-white  ${
                      errorEmailMessage
                        ? "border-[#fc3939] bg-[#fff2f4]"
                        : "border-[#d6d6d8]"
                    }`}
                    onChange={(e) => setEmail(e.target.value)}
                    onInput={() => setErrorEmailMessage("")}
                    onBlur={(e) => handleBlurInput(e.target)}
                  />
                  <span className="absolute bottom-[-30%] left-0 text-[14px] text-[#fc3939] font-medium">
                    {errorEmailMessage}
                  </span>
                </div>
                <div className="relative">
                  <label
                    htmlFor="email"
                    className={`text-[#999999] text-[16px] font-normal ${
                      errorPasswordMessage ? "text-[#fc3939]" : ""
                    }`}
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={`${showPass ? "text" : "password"}`}
                    className={`mt-2 outline-none border-2  rounded-md lg:py-2 py-3 px-4  text-[16px] leading-[24px] font-normal  w-full focus:border-blue-500 focus:border-2  ${
                      errorPasswordMessage
                        ? "border-[#fc3939] bg-[#fff2f4]"
                        : "border-[#d6d6d8] bg-white"
                    }`}
                    onChange={(e) => setPassword(e.target.value)}
                    onInput={() => setErrorPasswordMessage("")}
                    onBlur={(e) => handleBlurInput(e.target)}
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

                <div className="flex items-center justify-between mt-5">
                  <button
                    className="flex items-center justify-center bg-[#0077ed] py-3 rounded text-white text-[16px] font-medium leading-[26px] px-[48px]"
                    type="submit"
                  >
                    Sign In
                  </button>
                  <Link
                    to="/"
                    className="text-[#0077ed] text-[14px] font-normal leading-[24px] hover:underline"
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
    </div>
  );
};
export default LogIn;
