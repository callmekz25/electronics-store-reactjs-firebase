import { toast } from "react-toastify";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const HandleEmail = () => {
    if (email) {
      const formData = new FormData();
      formData.append("entry.2054652529", email);
      postGoogleForrm(formData);
    } else {
      toast.error("Please enter your email!");
    }
    async function postGoogleForrm(data) {
      fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfbW8kFURsU8PZXVUVcG1MM1a7iRmGk2bdgE0ZIXYVwoUlhyQ/formResponse",
        {
          method: "POST",
          body: data,
          mode: "no-cors",
        }
      );
      toast.success("Your email send!");
      setEmail("");
    }
  };
  return (
    <div className="py-[40px] lg:flex lg:justify-around grid grid-cols-1 gap-[30px] px-[20px] lg:px-0 bg-[#f0f0f0]">
      <ul className="flex flex-col gap-[24px]">
        <li className="text-[24px] font-semibold leading-[24px] tracking-[0.72px]">
          Exclusive
        </li>
        <li className="text-[20px] font-medium leading-[28px]">Subscribe</li>
        <li className="text-[16px] font-normal leading-[24px]">
          Get 10% off your first order
        </li>
        <li>
          <form
            className=""
            id="formFooter"
          >
            <div className="relative">
              <input
                type="email"
                id="emailFooter"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className=" border-gray-400 border-2  outline-none rounded px-[16px] py-[10px] placeholder:text-[16px] placeholder:font-normal placeholder:leading-[24px] w-full"
              />
              <button
                type="submit"
                form="form"
                onClick={HandleEmail}
                className="absolute right-[16px] top-[50%] translate-y-[-50%]"
              >
                <PaperAirplaneIcon className="text-black size-[25px]" />
              </button>
            </div>
          </form>
        </li>
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
