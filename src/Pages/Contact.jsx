import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Email from "../Assets/Contact/icons-mail.svg";
import Phone from "../Assets/Contact/icons-phone.svg";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import { LazyLoadImage } from "react-lazy-load-image-component";
const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    });
    const HandleContact = () => {
        const form = document.querySelector("#form");
        const email = document.querySelector("#email");
        const name = document.querySelector("#name");
        const phone = document.querySelector("#phone");
        const message = document.querySelector("#message");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (email.value && name.value && phone.value) {
                const formData = new FormData();
                formData.append("entry.1127365641", name.value);
                formData.append("entry.745302295", email.value);
                formData.append("entry.1691568330", phone.value);
                formData.append("entry.609877363", message.value);
                postGoogleForrm(formData);
            } else {
                toast.error("Please enter your information!");
            }
        });
        async function postGoogleForrm(data) {
            fetch(
                "https://docs.google.com/forms/u/0/d/e/1FAIpQLSc1rRRhWlmHXqPfDndq04jMe8k3CCrNj9ZVfv5NmC2bIb6U2g/formResponse",

                {
                    method: "POST",
                    body: data,
                    mode: "no-cors",
                }
            );
            toast.success("Your message send!");
            email.value = "";
            name.value = "";
            phone.value = "";
            message.value = "";
        }
    };
    return (
        <>
            <Nav />
            <div className="px-[135px] pb-[140px]">
                <div className="flex items-center gap-2 py-[80px]">
                    <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                        Home
                    </span>
                    <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                        /
                    </span>
                    <span className="text-black text-[14px] font-normal  leading-[21px]">
                        Contact
                    </span>
                </div>
                <div className="flex gap-[30px]">
                    <div className="px-[35px] py-[40px] rounded shadow-lg">
                        <div className="flex flex-col gap-[32px]">
                            <div className="">
                                <div className="flex items-center gap-4">
                                    <LazyLoadImage
                                        effect="blur"
                                        src={Phone}
                                        alt=""
                                        className="size-[40px]"
                                    />
                                    <span className="text-[16px] font-medium leading-[24px]">
                                        Call To Us
                                    </span>
                                </div>

                                <div className="pt-[24px] flex flex-col gap-4 text-[14px] font-normal leading-[21px]">
                                    <span>
                                        We are available 24/7, 7 days a week.
                                    </span>
                                    <span>Phone: 0899348258</span>
                                </div>
                            </div>
                            <div className="bg-black h-[1px]"></div>
                            <div className="">
                                <div className="flex items-center gap-4">
                                    <LazyLoadImage
                                        effect="blur"
                                        src={Email}
                                        alt="email"
                                        className="size-[40px]"
                                    />
                                    <span className="text-[16px] font-medium leading-[24px]">
                                        Write To US
                                    </span>
                                </div>
                                <div className="flex flex-col gap-4 text-[14px] font-normal leading-[21px] pt-[24px]">
                                    <span>
                                        Fill out our form and we will contact
                                        you within 24 hours.
                                    </span>
                                    <span>
                                        Emails:
                                        nguyenhongkhanhvinh2511@gmail.com
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" rounded shadow-lg py-[40px] px-[32px]">
                        <form
                            action=""
                            id="form"
                            className="flex flex-col gap-[32px] items-end"
                        >
                            <div className="grid grid-cols-3 gap-x-4 grid-rows-4 gap-y-[32px]">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="bg-[#F5F5F5] py-[16px] px-[13px] text-[16px] font-normal leading-[24px] outline-none"
                                    placeholder="Your Name"
                                />
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    className="bg-[#F5F5F5] py-[16px] px-[13px] text-[16px] font-normal leading-[24px] outline-none"
                                    placeholder="Your Email"
                                />
                                <input
                                    type="number"
                                    id="phone"
                                    name="phone"
                                    className="bg-[#F5F5F5] py-[16px] px-[13px] text-[16px] font-normal leading-[24px] outline-none "
                                    placeholder="Your Phone"
                                />
                                <textarea
                                    type="text"
                                    id="message"
                                    name="message"
                                    className=" col-span-3 row-span-3 bg-[#F5F5F5] px-[13px] py-[16px] text-[16px] font-normal leading-[24px] resize-none outline-none"
                                    placeholder="Your Message"
                                />
                            </div>
                            <button
                                type="submit"
                                form="form"
                                onClick={HandleContact}
                                className="text-white bg-[#DB4444] rounded flex items-center justify-center py-4 px-[48px] w-fit text-[16px] font-medium leading-[24px]"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
};
export default Contact;
