import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState } from "react";
import CountUp from "react-countup";
import Thum from "../Assets/About/Image.webp";
import Group from "../Assets/About/Group.svg";
import Sale from "../Assets/About/Icon-Sale.svg";
import Shopping from "../Assets/About/Icon-Shopping bag.svg";
import Money from "../Assets/About/Money.svg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ToastContainer } from "react-toastify";
import Featured from "../components/Featured";
import { Waypoint } from "react-waypoint";
const About = () => {
  const [onViewPort, setOnViewPort] = useState(false);

  return (
    <div className="lg:px-[135px]">
      <Nav />
      <div className=" pb-[140px] px-[20px] lg:px-0">
        <div className="flex items-center  gap-2 py-[80px]">
          <span className="text-[14px] font-normal opacity-40 leading-[21px]">
            Home
          </span>
          <span className="text-[14px] font-normal opacity-40 leading-[21px]">
            /
          </span>
          <span className="text-black text-[14px] font-normal leading-[21px]">
            About
          </span>
        </div>
        <div className="flex items-center lg:flex-row flex-col gap-[75px] pb-[140px]">
          <div
            className="flex flex-col gap-[40px]"
            data-aos="fade-right"
          >
            <h1 className="lg:text-[54px] font-semibold lg:leading-[64px] lg:tracking-[3.24px] text-[30px]">
              Our Story
            </h1>
            <div className="flex flex-col gap-[24px] lg:text-[16px] font-normal lg:leading-[26px] text-[20px]">
              <p>
                Launced in 2015, Exclusive is South Asia’s premier online
                shopping makterplace with an active presense in Bangladesh.
                Supported by wide range of tailored marketing, data and service
                solutions, Exclusive has 10,500 sallers and 300 brands and
                serves 3 millioons customers across the region.
              </p>
              <p>
                Exclusive has more than 1 Million products to offer, growing at
                a very fast. Exclusive offers a diverse assotment in categories
                ranging from consumer.
              </p>
            </div>
          </div>
          <div data-aos="fade-left">
            <LazyLoadImage
              src={Thum}
              alt="image about"
              effect="blur"
              className="w-full lg:h-full object-cover h-[500px]"
            />
          </div>
        </div>
      </div>
      <div className="lg:px-[135px] px-[20px] grid lg:grid-cols-4 grid-cols-2 lg:gap-[34px] gap-x-5 gap-y-10 pb-[30px]">
        <Waypoint
          onEnter={() => setOnViewPort(true)}
          onLeave={() => setOnViewPort(true)}
        >
          <div className="flex flex-col items-center justify-center gap-[24px] border-2  border-[gray-500] rounded lg:py-[30px] py-4 px-3 w-full h-full">
            <div className="size-[80px] rounded-full bg-[#c1c1c1] flex items-center justify-center">
              <div className="size-[60px] rounded-full bg-black flex items-center justify-center">
                <LazyLoadImage
                  src={Group}
                  alt=""
                  effect="blur"
                  className="size-[40px] "
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 lg:h-auto min-h-[110px]">
              <span className="text-[32px] font-semibold leading-[30px] tracking-[1.28px]">
                {onViewPort && (
                  <CountUp
                    start={0}
                    end={10.5}
                    duration={2}
                    decimals={1}
                  />
                )}
                K
              </span>
              <span className="lg:text-[16px] text-[18px] font-normal leading-[24px] text-center">
                Sallers active our site
              </span>
            </div>
          </div>
        </Waypoint>
        <Waypoint>
          <div className="flex flex-col items-center justify-center gap-[24px] shadow-md rounded bg-[#db4444] text-white lg:py-[30px] py-4 px-3 w-full h-full">
            <div className="size-[80px] rounded-full bg-[#e67c7c] flex items-center justify-center">
              <div className="size-[60px] rounded-full bg-[#ffffff] flex items-center justify-center">
                <LazyLoadImage
                  src={Sale}
                  effect="blur"
                  alt=""
                  className="size-[40px]"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 min-h-[110px] lg:h-auto">
              <span className="text-[32px] font-semibold leading-[30px] tracking-[1.28px]">
                {onViewPort && (
                  <CountUp
                    start={0}
                    end={35}
                    duration={2}
                    decimals={1}
                  />
                )}
                K
              </span>
              <span className="lg:text-[16px] text-[18px]  font-normal leading-[24px] text-center">
                Mopnthly Produduct Sale
              </span>
            </div>
          </div>
        </Waypoint>
        <Waypoint>
          <div className="flex flex-col items-center justify-center gap-[24px] border-2  border-[gray-500] rounded lg:py-[30px] py-4 px-3 w-full h-full">
            <div className="size-[80px] rounded-full bg-[#c1c1c1] flex items-center justify-center">
              <div className="size-[60px] rounded-full bg-black flex items-center justify-center">
                <LazyLoadImage
                  effect="blur"
                  src={Shopping}
                  alt=""
                  className="size-[40px] "
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 min-h-[110px] lg:h-auto ">
              <span className="text-[32px] font-semibold leading-[30px] tracking-[1.28px]">
                {onViewPort && (
                  <CountUp
                    start={0}
                    end={45.6}
                    duration={2}
                    decimals={1}
                  />
                )}
                K
              </span>
              <span className="lg:text-[16px] text-[18px]  font-normal leading-[24px] text-center">
                Customer active in our site
              </span>
            </div>
          </div>
        </Waypoint>
        <Waypoint>
          <div className="flex flex-col items-center justify-center gap-[24px] border-2  border-[gray-500] rounded lg:py-[30px] py-4 px-3 w-full h-full">
            <div className="size-[80px] rounded-full bg-[#c1c1c1] flex items-center justify-center">
              <div className="size-[60px] rounded-full bg-black flex items-center justify-center">
                <LazyLoadImage
                  src={Money}
                  effect="blur"
                  alt=""
                  className="size-[40px]"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 min-h-[110px] lg:h-auto">
              <span className="text-[32px] font-semibold leading-[30px] tracking-[1.28px]">
                {onViewPort && (
                  <CountUp
                    start={0}
                    end={25.6}
                    duration={2}
                    decimals={1}
                  />
                )}
                K
              </span>
              <span className="lg:text-[16px] text-[18px]  font-normal leading-[24px] text-center">
                Anual gross sale in our site
              </span>
            </div>
          </div>
        </Waypoint>
      </div>
      <Featured />
      <Footer />
      <ToastContainer />
    </div>
  );
};
export default About;
