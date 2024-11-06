import { toast } from "react-toastify";
import { PaperAirplaneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const handleEmail = () => {
    if (email) {
    } else {
      toast.error("Please enter your email!");
    }
  };
  return (
    <div className="relative lg:flex lg:justify-between grid grid-cols-1 gap-[30px] lg:px-[100px] px-[20px] bg-[#f0f0f0] lg:pt-[166px] pt-[200px] pb-10">
      <div className=" absolute left-0 w-full bottom-[100%] translate-y-[50%] px-[20px] lg:px-[100px]">
        <div className=" bg-black rounded-2xl py-8 px-5 lg:px-16 w-full flex lg:flex-row flex-col items-center justify-between">
          <span className="text-white font-bold text-[40px] lg:max-w-[50%] uppercase leading-[45px]">
            Stay upto date about our latest offers
          </span>
          <div className="flex flex-col justify-between gap-3 mt-5 lg:mt-0">
            <div className="relative">
              <EnvelopeIcon className="size-6 text-gray-500 absolute left-3 top-[50%] translate-y-[-50%]" />
              <input
                type="text"
                className="w-full rounded-full  py-3.5 pl-12 pr-4 outline-none text-[14px]"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button
              className="w-full rounded-full bg-white py-3.5 px-20 text-[14px] font-medium transition-all duration-300 hover:scale-105"
              onClick={handleEmail}
            >
              Subcribe to Newsletetter
            </button>
          </div>
        </div>
      </div>
      <ul className="flex flex-col gap-[24px]">
        <li className="text-[24px] font-semibold leading-[24px] tracking-[0.72px]">
          Exclusive
        </li>
        <li className="text-[20px] font-medium leading-[28px]">Subscribe</li>
        <li className="text-[16px] font-normal leading-[24px]">
          Get 10% off your first order
        </li>
        <li></li>
      </ul>
      <ul className="flex flex-col gap-[24px]">
        <li className="text-[20px] font-medium leading-[28px]">Support</li>
        <li className="text-[16px] font-normal leading-[24px]">
          111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
        </li>
        <li className="text-[16px] font-normal leading-[24px] w-full  break-words">
          nguyenhongkhanhvinh2511@gmail.com
        </li>
        <li className="text-[16px] font-normal leading-[24px]">0899348258</li>
      </ul>
      <ul className="flex flex-col gap-[24px]">
        <li className="text-[20px] font-medium leading-[28px]">Account</li>
        <li className="text-[16px] font-normal leading-[24px]">My Account</li>
        <li className="text-[16px] font-normal leading-[24px]">
          Login / Register
        </li>
        <li className="text-[16px] font-normal leading-[24px]">Cart</li>
        <li className="text-[16px] font-normal leading-[24px]">
          <a href="">Wishlist</a>
        </li>
        <li className="text-[16px] font-normal leading-[24px]">
          <a href="">Shop</a>
        </li>
      </ul>
      <ul className="flex flex-col gap-[24px]">
        <li className="text-[20px] font-medium leading-[28px]">Quick Link</li>
        <li className="text-[16px] font-normal leading-[24px]">
          <a href="#">Privacy Policy</a>
        </li>
        <li className="text-[16px] font-normal leading-[24px]">
          <a href="#">Terms Of Use</a>
        </li>
        <li className="text-[16px] font-normal leading-[24px]">
          <a href="">FAQ</a>
        </li>
        <li className="text-[16px] font-normal leading-[24px]">
          <a href="">Contact</a>
        </li>
      </ul>
    </div>
  );
};
export default Footer;
