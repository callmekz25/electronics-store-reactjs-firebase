import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Thum from "../Assets/Auth/image.webp";
import { Loading } from "../components/Loading";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "../Assets/Auth/Icon-Google.svg";
import { EyeIcon } from "@heroicons/react/24/solid";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const [errorPasswordMessage, setErrorPasswordMessage] = useState("");
  const [errorConfirmMessage, setErrorConfirmMessage] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Hàm xử lí validate và auth firebase upload thông tin người dùng lên Firestore database
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!name) {
      setErrorName("Your name cannot empty");
    }
    if (!email) {
      setErrorEmailMessage("Your email cannot empty");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorEmailMessage("Please enter a valid email");
    } else {
      setErrorEmailMessage("");
    }
    if (!password) {
      setErrorPasswordMessage("Your password cannot empty");
    } else if (password.length < 6) {
      setErrorPasswordMessage("Password must be at least 6 characters long");
    } else {
      setErrorPasswordMessage("");
    }
    if (!confirmPassword) {
      setErrorConfirmMessage("Please confirm your password");
    } else if (confirmPassword !== password) {
      setErrorConfirmMessage("Your password incorrect");
    } else {
      setErrorConfirmMessage("");
    }
    if (
      name &&
      !errorName &&
      email &&
      !errorEmailMessage &&
      password &&
      !errorPasswordMessage &&
      confirmPassword &&
      !errorConfirmMessage
    ) {
      try {
        // Sử dụng hàm xác thực tài khoản người dùng với auth

        await createUserWithEmailAndPassword(auth, email, password);
        // Lấy ra người dùng hiện tại
        const user = auth.currentUser;
        // Gửi email xác thực tài khoản thì mới log in được
        await sendEmailVerification(user)
          .then(() => {
            toast("Please verify your email to create!", {
              position: "top-center",
              autoClose: 1500,
            });
          })
          .catch((e) => console.log(e.message));
        // Có thông tin người dùng thì upload lên Firestore dùng id để phân biệt và lấy ra
        if (user) {
          if (user.emailVerified) {
          }
          let date = new Date();
          let day = date.getDate();
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          let hour = date.getHours();
          let minute = date.getMinutes();
          let currDay = `${day}/${month}/${year} ${hour}:${minute}`;

          await setDoc(doc(db, "Users", user.uid), {
            userId: user.uid,
            name: name,
            email: user.email,
            createdAt: currDay,
            verify: "Verified",
            role: "user",
          });
          setLoading(true);
          setLoading(false);
          navigate("/log-in");
        }
      } catch (e) {
        toast.error("Failed to create account!");
      }
    }
  };
  const handleLogInGoogle = async (e) => {
    e.preventDefault();
    // Tạo popup từ google
    const provider = new GoogleAuthProvider();
    // Dùng hàm sẵn của firebase để xác thực và truyền popup sau đó lấy dữ liệu khi người dùng đã đăng nhập bằng gg và đẩy lên Filestore
    signInWithPopup(auth, provider).then(async (result) => {
      if (result.user) {
        await setDoc(doc(db, "Users", result.user.uid), {
          email: result.user.email,
          name: result.user.displayName,
          photo: result.user.photoURL,
        });
        navigate("/");
      }
    });
  };
  const handleBlurInput = (input) => {
    if (input.name === "name") {
      if (!input.value) {
        setErrorName("Your name cannot empty!");
      } else {
        setErrorName("");
      }
    }
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
    if (input.name === "confirm-password") {
      if (!input.value) {
        setErrorConfirmMessage("Your confirm password cannot empty!");
      } else {
        setErrorConfirmMessage("");
      }
    }
  };
  return (
    <div className="lg:px-[135px] ">
      {!loading ? (
        <>
          <Nav hidden="hidden" />
          <div className="lg:py-[60px] py-[40px] px-[20px]">
            <h5
              className="lg:text-[40px] text-[30px] font-semibold leading-[44px]"
              data-aos="fade-in"
            >
              Discover New Features - Sign Up Now
            </h5>
            <div
              className="flex justify-center items-center flex-col py-[40px]"
              data-aos="fade-in"
            >
              <h1 className="lg:text-[30px] font-semibold lg:leading-[30px] text-[25px]">
                Create your account
              </h1>
              <form className="flex flex-col pt-[48px] lg:gap-[30px] gap-[34px] lg:w-[400px]">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className={`text-[#999999] text-[16px] font-normal ${
                      errorName ? "text-[#fc3939]" : ""
                    }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`mt-2 outline-none border-2 border-[gray-500] rounded-md lg:py-2 py-3 px-4  text-[16px] leading-[24px] font-normal  w-full focus:border-blue-500 focus:border-2 focus:bg-white  ${
                      errorName ? "border-[#fc3939] bg-[#fff9f9]" : ""
                    }`}
                    onChange={(e) => setName(e.target.value)}
                    onInput={() => setErrorName("")}
                    onBlur={(e) => handleBlurInput(e.target)}
                  />
                  <span className="absolute bottom-[-30%] left-0 text-[14px] text-[#fc3939] font-medium">
                    {errorName}
                  </span>
                </div>
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
                    className={`mt-2 outline-none border-2 border-[gray-500] rounded-md lg:py-2 py-3 px-4  text-[16px] leading-[24px] font-normal  w-full  focus:border-blue-500 focus:border-2 focus:bg-white ${
                      errorEmailMessage ? "border-[#fc3939] bg-[#fff9f9]" : ""
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
                    htmlFor="password"
                    className={`text-[#999999] text-[16px] font-normal ${
                      errorPasswordMessage ? "text-[#fc3939]" : ""
                    }`}
                  >
                    Password
                  </label>
                  <input
                    type={`${showPass ? "text" : "password"}`}
                    id="password"
                    name="password"
                    className={`mt-2 outline-none border-2 border-[gray-500] rounded-md lg:py-2 py-3 px-4  text-[16px] leading-[24px] font-normal  w-full focus:border-blue-500 focus:border-2 focus:bg-white ${
                      errorPasswordMessage
                        ? "border-[#fc3939] bg-[#fff9f9]"
                        : ""
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
                    className={`size-[20px] text-gray-500 absolute right-[5%] top-[50%] translate-y-[30%]  hover:cursor-pointer ${
                      showPass ? "block" : "hidden"
                    }`}
                    onClick={() => setShowPass(false)}
                  />
                  <span className="absolute bottom-[-30%] left-0 text-[14px] text-[#fc3939] font-medium">
                    {errorPasswordMessage}
                  </span>
                </div>
                <div className="relative">
                  <label
                    htmlFor="confirm-password"
                    className={`text-[#999999] text-[16px] font-normal ${
                      errorConfirmMessage ? "text-[#fc3939]" : ""
                    }`}
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    className={`mt-2 outline-none border-2 border-[gray-500] rounded-md lg:py-2 py-3 px-4  text-[16px] leading-[24px] font-normal  w-full focus:border-blue-500 focus:border-2 focus:bg-white  ${
                      errorConfirmMessage ? "border-[#fc3939] bg-[#fff9f9]" : ""
                    }`}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onInput={() => setErrorConfirmMessage("")}
                    onBlur={(e) => handleBlurInput(e.target)}
                  />
                  <span className="absolute bottom-[-30%] left-0 text-[14px] text-[#fc3939] font-medium">
                    {errorConfirmMessage}
                  </span>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <button
                    className="flex items-center justify-center bg-[#0077ed] py-4 rounded text-white text-[16px] font-medium leading-[24px]"
                    onClick={handleCreateAccount}
                  >
                    Sign Up
                  </button>
                  <div className="flex items-center justify-center text-[16px] text-[#837f7f] h-[2px] bg-gray-200 relative my-3">
                    <span className="px-3 bg-[#f5f5f7] absolute  top-[50%]  translate-y-[-50%]">
                      or
                    </span>
                  </div>
                  <button
                    className="flex items-center gap-4 justify-center border border-[#999999] py-4 rounded"
                    onClick={handleLogInGoogle}
                  >
                    <img
                      src={GoogleIcon}
                      alt="google-icon"
                      className="size-[24px]"
                    />
                    <span>Log in with Google</span>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <span className="text-[#504e4e] text-[16px] font-normal leading-[24px]">
                    Already have account?
                  </span>
                  <span className="text-[16px] font-medium leading-[24px] border-b border-black">
                    <Link to="/log-in">Log in</Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
          <Footer />
          <ToastContainer />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};
export default SignUp;
