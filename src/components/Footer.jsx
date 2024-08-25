import { toast } from "react-toastify";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const Footer = () => {
    const HandleEmail = () => {
        const form = document.querySelector("#form");
        const email = document.querySelector("#email");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (email.value) {
                const formData = new FormData();
                formData.append("entry.2054652529", email.value);
                postGoogleForrm(formData);
            } else {
                toast.error("Please enter your email!");
            }
        });
        async function postGoogleForrm(data) {
            fetch(
                "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfbW8kFURsU8PZXVUVcG1MM1a7iRmGk2bdgE0ZIXYVwoUlhyQ/formResponse",

                {
                    method: "POST",
                    body: data,
                    mode: "no-cors",
                }
            );
            toast.success("Your email send");
            email.value = "";
        }
    };

    return (
        <div className="py-[80px] flex justify-around bg-black text-white">
            <ul className="flex flex-col gap-[24px]">
                <li className="text-[24px] font-semibold leading-[24px] tracking-[0.72px]">
                    Exclusive
                </li>
                <li className="text-[20px] font-medium leading-[28px]">
                    Subscribe
                </li>
                <li className="text-[16px] font-normal leading-[24px]">
                    Get 10% off your first order
                </li>
                <li>
                    <form
                        className=""
                        id="form"
                        action=""
                    >
                        <div className="relative">
                            <input
                                type="text"
                                id="email"
                                placeholder="Enter your email"
                                className="border border-white bg-black outline-none rounded px-[16px] py-[10px] placeholder:text-[16px] placeholder:font-normal placeholder:leading-[24px]"
                            />
                            <button
                                type="submit"
                                form="form"
                                onClick={HandleEmail}
                                className="absolute right-[16px] top-[50%] translate-y-[-50%]"
                            >
                                <PaperAirplaneIcon className="text-white size-[25px]" />
                            </button>
                        </div>
                    </form>
                </li>
            </ul>
            <ul className="flex flex-col gap-[24px]">
                <li className="text-[20px] font-medium leading-[28px]">
                    Support
                </li>
                <li className="text-[16px] font-normal leading-[24px]">
                    111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
                </li>
                <li className="text-[16px] font-normal leading-[24px]">
                    nguyenhongkhanhvinh2511@gmail.com
                </li>
                <li className="text-[16px] font-normal leading-[24px]">
                    0899348258
                </li>
            </ul>
            <ul className="flex flex-col gap-[24px]">
                <li className="text-[20px] font-medium leading-[28px]">
                    Account
                </li>
                <li className="text-[16px] font-normal leading-[24px]">
                    My Account
                </li>
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
                <li className="text-[20px] font-medium leading-[28px]">
                    Quick Link
                </li>
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
            <ul className="flex flex-col gap-[24px]">
                <li className="text-[20px] font-medium leading-[28px]">
                    Download App
                </li>
                <li className="text-[12px] font-medium leading-[18px] opacity-70">
                    <a href="#">Save $3 with App New User Only</a>
                </li>
            </ul>
        </div>
    );
};
export default Footer;
