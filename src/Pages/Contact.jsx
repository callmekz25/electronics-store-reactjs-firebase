import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Email from "../Assets/Contact/icons-mail.svg";
import Phone from "../Assets/Contact/icons-phone.svg";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { sendMailSupport } from "../Service/SendMail";
import { LazyLoadImage } from "react-lazy-load-image-component";
const Contact = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleContact = async (name, email, phone, message) => {
    if (email && name && phone && message) {
      sendMailSupport(name, phone, email, message);
    } else {
      toast.error("Please enter your information!");
    }
  };
  return (
    <div className="bg-white">
      <Nav />
      <div className="px-[20px] lg:px-[100px] mb-[300px] ">
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
        <div className="flex gap-[30px] lg:flex-row flex-col">
          <div
            className="px-[35px] py-[40px] flex flex-col  justify-center rounded-xl shadow-xl"
            data-aos="fade-in"
          >
            <div className="flex flex-col gap-[32px]">
              <>
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
                  <span>We are available 24/7, 7 days a week.</span>
                  <span>Phone: 0899348258</span>
                </div>
              </>
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
                    Fill out our form and we will contact you within 24 hours.
                  </span>
                  <span>Emails: nguyenhongkhanhvinh2511@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className=" rounded-xl shadow-xl lg:py-[40px] lg:px-[32px] px-7 py-10"
            data-aos="fade-in"
          >
            <form className="flex flex-col gap-[32px] lg:items-end">
              <div className="grid lg:grid-cols-3 lg:grid-rows-4 lg:gap-x-4 grid-cols-1 gap-y-[32px]">
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  className="border-2 border-gray-200 rounded-md lg:py-2.5 lg:px-[13px] py-3 px-4 col-span-1 text-[16px] font-normal lg:h-fit leading-[24px] outline-none"
                  placeholder="Your Name"
                />
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="border-2 border-gray-200  rounded-md lg:py-2.5 lg:h-fit lg:px-[13px] py-3 px-4 text-[16px] font-normal leading-[24px] outline-none"
                  placeholder="Your Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="border-2 border-gray-200 rounded-md lg:py-2.5 lg:h-fit lg:px-[13px] py-3 px-4 text-[16px] font-normal leading-[24px] outline-none "
                  placeholder="Your Phone"
                  onChange={(e) => setPhone(e.target.value)}
                />
                <textarea
                  type="text"
                  id="message"
                  name="message"
                  className="border-2 border-gray-200 lg:row-span-3 lg:col-span-3 rounded-md lg:py-4 lg:px-[13px] py-3 px-4 text-[16px] font-normal leading-[24px] resize-none outline-none "
                  placeholder="Your Message"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleContact(name, phone, email, message)}
                className="text-white bg-[#db4444] rounded flex items-center justify-center py-2.5 px-[30px] lg:w-fit w-full lg:text-[14px] text-[16px] font-medium leading-[24px]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};
export default Contact;
