import ship from "../Assets/Featured/icon-delivery.svg";
import service from "../Assets/Featured/Icon-Customer service.svg";
import tick from "../Assets/Featured/shield-tick.svg";
import { LazyLoadImage } from "react-lazy-load-image-component";
const Featured = () => {
  return (
    <div className="py-[200px] lg:px-[100px] px-[20px]">
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-3 lg:gap-[88px] gap-[30px]">
          <div
            className="flex flex-col items-center justify-center gap-[24px]"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="lg:size-[80px] size-[70px] rounded-full bg-[#c1c1c1] flex items-center justify-center">
              <div className="lg:size-[55px] size-[45px] rounded-full bg-black flex items-center justify-center">
                <LazyLoadImage
                  effect="blur"
                  src={ship}
                  alt="delivery"
                  className="lg:size-[40px] size-[30px] object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="lg:text-[20px] text-[16px] text-center font-semibold leading-[28px]">
                FREE AND FAST DELIVERY
              </span>
              <span className="text-[14px] font-normal text-center leading-[21px]">
                Free delivery for all orders over $140
              </span>
            </div>
          </div>
          <div
            className="flex flex-col items-center justify-center gap-[24px]"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <div className="lg:size-[80px] size-[70px] rounded-full bg-[#c1c1c1] flex items-center justify-center">
              <div className="lg:size-[55px] size-[45px] rounded-full bg-black flex items-center justify-center">
                <LazyLoadImage
                  effect="blur"
                  src={service}
                  alt="delivery"
                  className="lg:size-[40px] size-[30px] object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="lg:text-[20px] text-center text-[16px] font-semibold leading-[28px]">
                24/7 CUSTOMER SERVICE
              </span>
              <span className="text-[14px] text-center font-normal leading-[21px]">
                Friendly 24/7 customer support
              </span>
            </div>
          </div>
          <div
            className="flex flex-col items-center justify-center gap-[24px] lg:col-span-1 col-span-2"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="lg:size-[80px] size-[70px] rounded-full bg-[#c1c1c1] flex items-center justify-center">
              <div className="lg:size-[55px] size-[45px] rounded-full bg-black flex items-center justify-center">
                <LazyLoadImage
                  effect="blur"
                  src={tick}
                  alt="delivery"
                  className="lg:size-[40px] size-[30px] object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="lg:text-[20px] text-center text-[16px] font-semibold leading-[28px]">
                MONEY BACK GUARANTEE
              </span>
              <span className="text-[14px] text-center font-normal leading-[21px]">
                We reurn money within 30 days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Featured;
