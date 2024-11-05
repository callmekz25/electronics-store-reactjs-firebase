import Product from "../Assets/SpecialProduct/Product.webp";

import { LazyLoadImage } from "react-lazy-load-image-component";
export const SpecialProduct = () => {
  return (
    <div className="py-[80px] px-[20px] lg:px-[100px]">
      <div className="bg-black  w-full h-full flex items-center  lg:flex-row flex-col justify-between lg:px-[56px] px-[20px] rounded-2xl lg:py-[70px] py-[30px]">
        <div className="flex flex-col gap-[32px] ">
          <span
            className="text-[16px] font-semibold leading-[20px] text-[#00FF66]"
            data-aos="fade-up"
          >
            Categories
          </span>
          <h1
            className="lg:text-[48px] text-[25px] font-medium lg:leading-[60px] tracking-[1.92px] text-white"
            data-aos="fade-up"
          >
            Enhance Your Music Experience
          </h1>
          <div
            className="flex items-center gap-[24px]"
            data-aos="fade-up"
          >
            <div className="bg-white rounded-full flex items-center justify-center py-[10px] px-[15px] size-[62px]">
              <div className="flex flex-col items-center">
                <span className="text-[16px] font-semibold leading-[20px]">
                  00
                </span>
                <span className="text-[11px] font-normal leading-[18px]">
                  Hours
                </span>
              </div>
            </div>
            <div className="bg-white rounded-full flex items-center justify-center py-[10px] px-[15px] size-[62px]">
              <div className="flex flex-col items-center">
                <span className="text-[16px] font-semibold leading-[20px]">
                  {"00"}
                </span>
                <span className="text-[11px] font-normal leading-[18px]">
                  Minutes
                </span>
              </div>
            </div>
            <div className="bg-white rounded-full flex items-center justify-center py-[10px] px-[15px] size-[62px]">
              <div className="flex flex-col items-center">
                <span className="text-[16px] font-semibold leading-[20px]">
                  {"00"}
                </span>
                <span className="text-[11px] font-normal leading-[18px]">
                  Seconds
                </span>
              </div>
            </div>
          </div>
          <button
            className="px-[48px] py-[16px] rounded bg-[#00FF66] text-white text-[16px] font-medium leading-[24px] items-center justify-center w-fit lg:flex hidden"
            data-aos="fade-up"
          >
            Buy Now!
          </button>
        </div>
        <div
          className=""
          data-aos="fade-up"
        >
          <LazyLoadImage
            effect="blur"
            src={Product}
            alt="special-product"
            className="object-cover lg:h-[300px] lg:w-[700px] w-[400px] h-[200px]"
          />
        </div>
        <button
          className="px-[48px] mt-5 flex py-[16px] rounded bg-[#00FF66]  text-white text-[18px] font-medium leading-[24px] items-center justify-center w-full lg:hidden "
          data-aos="fade-up"
        >
          <span>Buy Now!</span>
        </button>
      </div>
    </div>
  );
};
