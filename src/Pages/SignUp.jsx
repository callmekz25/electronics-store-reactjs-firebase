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
            setErrorPasswordMessage(
                "Password must be at least 6 characters long"
            );
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
            errorName === "" &&
            email &&
            errorEmailMessage === "" &&
            password &&
            errorPasswordMessage === "" &&
            confirmPassword &&
            errorConfirmMessage === ""
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
                toast.error("Failed to create account: " + e.message);
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
    return (
        <>
            {!loading ? (
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
                        <div className="flex justify-center flex-col py-[120px]">
                            <h1 className="lg:text-[36px] font-semibold lg:leading-[30px] ">
                                Create your account
                            </h1>

                            <form
                                action=""
                                className="flex flex-col pt-[48px] gap-[30px] w-[400px]"
                            >
                                <div className="relative">
                                    <label
                                        htmlFor="name"
                                        className="text-[#999999] text-[16px] font-normal"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className={`mt-2 outline-none border-2 border-[gray-500] rounded-md py-2 px-4  text-[16px] leading-[24px] font-normal  w-full  ${
                                            errorName
                                                ? "border-[#fc3939] bg-[#fff9f9]"
                                                : ""
                                        }`}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        onInput={() => setErrorName("")}
                                    />
                                    <span className="absolute bottom-[-30%] left-0 text-[14px] text-[#fc3939] font-medium">
                                        {errorName}
                                    </span>
                                </div>
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
                                        htmlFor="password"
                                        className="text-[#999999] text-[16px] font-normal"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type={`${
                                            showPass ? "text" : "password"
                                        }`}
                                        id="password"
                                        name="password"
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
                                        className="text-[#999999] text-[16px] font-normal"
                                    >
                                        Confirm password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        name="confirm-password"
                                        className={`mt-2 outline-none border-2 border-[gray-500] rounded-md py-2 px-4  text-[16px] leading-[24px] font-normal  w-full  ${
                                            errorConfirmMessage
                                                ? "border-[#fc3939] bg-[#fff9f9]"
                                                : ""
                                        }`}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        onInput={() =>
                                            setErrorConfirmMessage("")
                                        }
                                    />
                                    <span className="absolute bottom-[-30%] left-0 text-[14px] text-[#fc3939] font-medium">
                                        {errorConfirmMessage}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <button
                                        className="flex items-center justify-center bg-[#DB4444] py-4 rounded text-white text-[16px] font-medium leading-[24px]"
                                        onClick={handleCreateAccount}
                                    >
                                        Create Account
                                    </button>
                                    <div className="flex items-center justify-center text-[16px] text-[#837f7f] h-[2px] bg-gray-200 relative my-3">
                                        <span className="px-3 bg-white absolute  top-[50%]  translate-y-[-50%]">
                                            or
                                        </span>
                                    </div>
                                    <button
                                        className="flex items-center gap-4 justify-center border border-[#999999] py-4 rounded"
                                        onClick={handleLogInGoogle}
                                    >
                                        <img
                                            src={GoogleIcon}
                                            alt=""
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
        </>
    );
};
export default SignUp;
