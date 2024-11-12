import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useState, useEffect, useContext } from "react";
import {
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
} from "firebase/auth";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { Loading } from "../components/Loading";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../Context/UserContext";
import { EyeIcon } from "@heroicons/react/24/solid";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
// import { Error } from "./Error";
const Profile = () => {
  const [info, setInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const navigate = useNavigate();
  // State đổi tab render UI
  const [clickEmail, setClickEmail] = useState(false);
  const [clickEdit, setClickEdit] = useState(false);
  const [clickProfile, setClickProfile] = useState(true);
  const [clickPass, setClickPass] = useState(false);
  // State để change user password
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // State render lỗi validate phần changes email
  const [erorrEmail, setErorrEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [passEmail, setPassEmail] = useState("");

  // State phần show hide pass
  const [showPass, setShowPass] = useState(false);
  // State button cancel
  const [cancel, setCancel] = useState(false);
  const { user, currentUser, loading } = useContext(UserContext);
  const [loadingChange, setLoadingChange] = useState(false);

  useEffect(() => {
    if (user) {
      setInfo({
        name: user.name,
        address: user.address,
        phone: user.phone,
      });
    }
  }, [user]);
  // Hàm update email khi user muốn thay đổi email
  const updateEmailUser = async (newEmail, password) => {
    try {
      if (!currentUser) {
        toast.error("Error: not found account!");
      } else {
        if (!newEmail) {
          setErorrEmail("New email cannot empty!");
        }
        if (!password) {
          setErrorPass("Password cannot empty!");
        }
        if (newEmail && password) {
          if (/\S+@\S+\.\S+/.test(newEmail)) {
            const credential = EmailAuthProvider.credential(
              currentUser.email,
              password
            );
            await reauthenticateWithCredential(currentUser, credential);
            await updateEmail(currentUser, newEmail);
            await sendEmailVerification(currentUser);
            const userRef = doc(db, "Users", currentUser.uid);
            await updateDoc(userRef, {
              email: newEmail,
            });
            toast(`Please verify your email ${newEmail}!`);
          } else {
            setErorrEmail("Please enter a valid email");
          }
        }
      }
    } catch (e) {
      setErrorPass("Incorrect password!");
    }
  };
  const handleUpdateEmail = () => {
    if (currentUser) {
      updateEmailUser(newEmail, passEmail);
    }
  };
  // Hàm update change pass của user
  const handleUpdatePassword = async (currentPassword, newPassword) => {
    try {
      if (currentUser) {
        if (!password) {
          toast.error("Password cann't empty!");
        }
        if (!newPassword) {
          toast.error("New password cann't empty!");
        } else if (newPassword.length < 6) {
          toast.error("New password must be long 6 character!");
        }
        if (!confirmPassword) {
          toast.error("Confirm password cann't empty!");
        }
        if (
          currentUser.email &&
          currentPassword &&
          newPassword &&
          confirmPassword
        ) {
          if (newPassword.match(confirmPassword)) {
            const credential = EmailAuthProvider.credential(
              currentUser.email,
              password
            );
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword)
              .then(() => {
                setLoadingChange(true);
                setTimeout(() => {
                  toast.success("Changes your password successfully!");
                }, 1200);
                setTimeout(() => {
                  setLoadingChange(false);
                  auth.signOut();
                  navigate("/sign-up");
                }, 2000);
              })
              .catch((e) => {
                toast.error("Update password fail!", {
                  position: "top-center",
                  autoClose: 1500,
                });
              });
          } else {
            toast.error("Confirm password not match your new password!");
          }
        } else {
          toast.error("Error: cann't changes your password!");
        }
      } else {
        navigate("/sign-up");
      }
    } catch (error) {
      navigate("/log-in");
    }
  };

  const takeInfo = (e) => {
    const { id, value } = e.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [id]: value,
    }));
  };

  const handleEditProfile = async (e) => {
    setLoadingChange(true);
    e.preventDefault();
    if (currentUser) {
      let updates = {};
      if (info.name) updates.name = info.name;
      if (info.address) updates.address = info.address;
      if (info.phone) updates.phone = info.phone;
      try {
        const userRef = doc(db, "Users", currentUser.uid);
        await updateDoc(userRef, updates);
        setLoadingChange(false);
        toast.success("Your account has been updated successfully!");
        setCancel(false);
      } catch (e) {
        toast.error(`Edit your profile fail!`, {
          position: "top-center",
          autoClose: 1500,
        });
      }
    } else {
      toast.error("Error: not found user!", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  const handleCancelEditProfile = () => {
    setInfo({
      name: user.name,
      address: user.address || "",
      phone: user.phone || "",
    });
    setPassEmail("");
    setNewEmail("");
    setCancel(false);
  };

  return (
    <div className="bg-white">
      <Nav />
      {loading || loadingChange ? (
        <Loading />
      ) : (
        <div className="lg:px-[100px] mb-20 px-[20px]">
          <div className=" py-[80px]">
            <div className="flex items-center justify-between text-[14px] font-normal leading-[21px]">
              <div className="flex items-center gap-2">
                <span className="opacity-40">Home</span>
                <span className=" opacity-40 ">/</span>
                <span className="text-black">My Account</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Welcome!</span>
                <span className="text-[#DB4444]">Kzzz</span>
              </div>
            </div>
            <div className="py-[80px]">
              <div className="grid grid-cols-4">
                <div className="col-span-1 flex flex-col gap-[24px]">
                  <div className="flex flex-col gap-4">
                    <span className="text-[16px] font-medium leading-[24px]">
                      Manage My Account
                    </span>
                    <ul className="flex flex-col gap-2 text-[16px] font-normal leading-[24px] text-[#b3b3b3]">
                      <li>
                        <button
                          onClick={() => {
                            setClickProfile(true);
                            setClickEdit(false);
                            setClickEmail(false);
                            setClickPass(false);
                          }}
                          className={`${clickProfile ? "text-black" : ""}`}
                        >
                          My Profile
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setClickEdit(true);
                            setClickProfile(false);
                            setClickEmail(false);
                            setClickPass(false);
                          }}
                          className={`${clickEdit ? "text-black" : ""}`}
                        >
                          Edit Profile
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setClickPass(true);
                            setClickEdit(false);
                            setClickProfile(false);
                            setClickEmail(false);
                          }}
                          className={`${clickPass ? "text-black" : ""}`}
                        >
                          Change password
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                {clickEdit ? (
                  <div className="py-[40px] px-[80px] box-shadow col-span-3">
                    <span className="text-[20px] font-medium leading-[28px] text-[#DB4444]">
                      Edit Your Profile
                    </span>
                    <div className="grid grid-cols-2 grid-rows-3 pt-3 gap-x-[50px] gap-y-[24px] text-[16px] font-normal leading-[24px]">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="fname">Name</label>
                        <input
                          type="text"
                          id="name"
                          className=" rounded px-4 py-[13px] bg-[#eae8e8] w-full outline-none"
                          onChange={takeInfo}
                          value={info.name}
                          onInput={(e) => {
                            setCancel(true);
                            if (e.target.value === "") {
                              setCancel(false);
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="text"
                          id="phone"
                          className=" rounded px-4 py-[13px] bg-[#eae8e8] w-full outline-none"
                          placeholder="(84+)"
                          onChange={takeInfo}
                          value={info.phone}
                          onInput={(e) => {
                            setCancel(true);
                            if (e.target.value === "") {
                              setCancel(false);
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-start">
                        <label htmlFor="accEmail">Email</label>
                        <input
                          type="text"
                          id="accEmail"
                          className=" rounded px-4 py-[13px] bg-[#eae8e8] w-full outline-none"
                          value={user.email}
                          disabled
                        />
                        <button
                          onClick={() => {
                            setClickEdit(false);
                            setClickEmail(true);
                            setClickProfile(false);
                            setClickPass(false);
                          }}
                          className="text-[14px] font-normal underline text-blue-500"
                        >
                          Changes your email
                        </button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="address">Address</label>
                        <input
                          type="text"
                          id="address"
                          className=" rounded px-4 py-[13px] bg-[#eae8e8] w-full outline-none"
                          placeholder="Kingston, 5236, United State"
                          onChange={takeInfo}
                          value={info.address}
                          onInput={(e) => {
                            setCancel(true);
                            if (e.target.value === "") {
                              setCancel(false);
                            }
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-end col-span-2 gap-[32px]">
                        <button
                          className={`py-4 text-[16px] font-normal leading-[24px] ${
                            cancel ? "block" : "hidden"
                          }`}
                          onClick={handleCancelEditProfile}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-10 py-3 bg-[#DB4444] rounded text-white lg:text-[16px] font-medium leading-[24px]"
                          onClick={handleEditProfile}
                          disabled={cancel ? false : true}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {clickEmail ? (
                  <div className="py-[40px] px-[80px] box-shadow col-span-3">
                    <span className="text-[20px] font-medium leading-[28px] text-[#DB4444]">
                      Changes your email
                    </span>
                    <div className="grid grid-cols-2 grid-rows-4 pt-8 gap-x-[50px] gap-y-[24px] text-[16px] font-normal leading-[24px]">
                      <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="">Current Email</label>
                        <input
                          type="text"
                          id=""
                          className=" rounded px-4 py-[13px] bg-[#eae8e8] w-full"
                          value={user.email}
                          disabled
                        />
                      </div>
                      <div className="flex flex-col gap-2 col-span-2 relative">
                        <label htmlFor="newEmail">New Email</label>
                        <input
                          type="text"
                          id="newEmail"
                          value={newEmail}
                          className={`rounded px-4 py-[13px] bg-[#eae8e8] w-full outline-none ${
                            erorrEmail
                              ? "border-2 border-[#fc3939] bg-[#fff9f9]"
                              : ""
                          }`}
                          onChange={(e) => setNewEmail(e.target.value)}
                          onInput={(e) => {
                            setErorrEmail("");
                            setCancel(true);
                            if (!e.target.value) {
                              setCancel(false);
                            }
                          }}
                        />
                        <span className="absolute bottom-[-25px] text-[12px] leading-[24px] text-[#DB4444]">
                          {erorrEmail}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 col-span-2 relative">
                        <label htmlFor="password">Password</label>
                        <input
                          type={`${showPass ? "text" : "password"}`}
                          id="password"
                          value={passEmail}
                          className={`rounded px-4 py-[13px] bg-[#eae8e8] w-full outline-none ${
                            errorPass
                              ? "border-2 border-[#fc3939] bg-[#fff9f9]"
                              : ""
                          }`}
                          onChange={(e) => setPassEmail(e.target.value)}
                          onInput={(e) => {
                            setErrorPass("");
                            setCancel(true);
                            if (!e.target.value) {
                              setCancel(false);
                            }
                          }}
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
                        <span className="absolute bottom-[-25px] text-[12px] leading-[24px] text-[#DB4444]">
                          {errorPass}
                        </span>
                      </div>

                      <div className="flex items-center justify-end col-span-2 gap-[32px]">
                        <button
                          className={`py-4 text-[16px] font-normal leading-[24px] ${
                            cancel ? "block" : "hidden"
                          }`}
                          onClick={() =>
                            handleCancelEditProfile(password, newPassword)
                          }
                        >
                          Cancel
                        </button>
                        <button
                          className="px-[48px] py-4 bg-[#DB4444] rounded text-white text-[16px] font-medium leading-[24px]"
                          onClick={handleUpdateEmail}
                          disabled={cancel ? false : true}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {clickProfile ? (
                  <div className="py-[40px] px-[80px] box-shadow col-span-3">
                    <span className="text-[20px] font-medium leading-[28px] text-[#DB4444]">
                      Your Profile
                    </span>
                    <div className="grid grid-cols-2 grid-rows-5 pt-8 gap-x-[50px] gap-y-[30px] text-[16px] font-normal leading-[24px]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Name:</span>
                        <span>{user.displayName || info.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Email:</span>
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Phone:</span>
                        <span>
                          {!info.phone ? (
                            <button
                              className="text-[14px] font-normal underline text-blue-500"
                              onClick={() => {
                                setClickEdit(true);
                                setClickEmail(false);
                                setClickProfile(false);
                              }}
                            >
                              Add phone number
                            </button>
                          ) : (
                            info.phone
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Address:</span>
                        <span>
                          {!info.address ? (
                            <button
                              className="text-[14px] font-normal underline text-blue-500"
                              onClick={() => {
                                setClickEdit(true);
                                setClickEmail(false);
                                setClickProfile(false);
                              }}
                            >
                              Add address
                            </button>
                          ) : (
                            info.address
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {clickPass ? (
                  <div className="py-[40px] px-[80px] box-shadow col-span-3">
                    <span className="text-[20px] font-medium leading-[28px] text-[#DB4444]">
                      Changes your password
                    </span>
                    <div className="grid grid-cols-2 grid-rows-3 pt-10 gap-x-[50px] gap-y-[24px] text-[16px] font-normal leading-[24px]">
                      <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="fname">Password</label>

                        <input
                          type="password"
                          id="name"
                          className=" rounded px-4 py-[13px] bg-[#eae8e8] w-full"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          onInput={(e) => {
                            setCancel(true);
                            if (e.target.value === "") {
                              setCancel(false);
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2 col-span-2">
                        <label htmlFor="phone">New password</label>
                        <input
                          type="password"
                          id="phone"
                          className=" rounded px-4 py-[13px] bg-[#eae8e8] w-full"
                          onChange={(e) => setNewPassword(e.target.value)}
                          value={newPassword}
                          onInput={(e) => {
                            setCancel(true);
                            if (e.target.value === "") {
                              setCancel(false);
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-start col-span-2">
                        <label htmlFor="accEmail">Confirm password</label>
                        <input
                          type="password"
                          id="accEmail"
                          className=" rounded px-4 py-[13px] bg-[#eae8e8] w-full"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          value={confirmPassword}
                        />
                      </div>

                      <div className="flex items-center justify-end col-span-2 gap-[32px]">
                        <button
                          className={`py-4 text-[16px] font-normal leading-[24px] ${
                            cancel ? "block" : "hidden"
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-[48px] py-4 bg-[#DB4444] rounded text-white text-[16px] font-medium leading-[24px]"
                          onClick={() =>
                            handleUpdatePassword(password, newPassword)
                          }
                          disabled={cancel ? false : true}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <ToastContainer />
    </div>
  );
};
export default Profile;
