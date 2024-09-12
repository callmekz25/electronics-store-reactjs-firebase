import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState } from "react";
import CountUp from "react-countup";
import Thum from "../Assets/About/Image.webp";
import Group from "../Assets/About/Group.svg";
import Sale from "../Assets/About/Icon-Sale.svg";
import Shopping from "../Assets/About/Icon-Shopping bag.svg";
import Money from "../Assets/About/Money.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "boxicons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ToastContainer } from "react-toastify";
import ship from "../Assets/Featured/icon-delivery.svg";
import service from "../Assets/Featured/Icon-Customer service.svg";
import tick from "../Assets/Featured/shield-tick.svg";
import ScrollTrigger from "react-scroll-trigger";
import Featured from "../components/Featured";
const About = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  const [onViewPort, setOnViewPort] = useState(false);
  const [infoBoss, setInfoBoss] = useState([]);

  // useEffect(() => {
  //     window.scrollTo(0, 0);
  //     get(child(dbRef, `infoCEO`))
  //         .then((snapshot) => {
  //             if (snapshot.exists()) {
  //                 const data = snapshot.val();
  //                 setInfoBoss(data);
  //             } else {
  //                 console.log("No data available");
  //             }
  //         })
  //         .catch((error) => {
  //             console.error(error);
  //         });
  // }, [dbRef]);

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
        <ScrollTrigger
          onEnter={() => setOnViewPort(true)}
          onExit={() => setOnViewPort(true)}
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
        </ScrollTrigger>
        <ScrollTrigger>
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
        </ScrollTrigger>
        <ScrollTrigger>
          <div className="flex flex-col items-center justify-center gap-[24px] border-2  border-[gray-500] rounded lg:py-[30px] py-4 px-3 w-full h-full">
            <div className="size-[80px] rounded-full bg-[#c1c1c1] flex items-center justify-center">
              <div className="size-[60px] rounded-full bg-black flex items-center justify-center">
                <LazyLoadImage
                  effect="blurr"
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
        </ScrollTrigger>
        <ScrollTrigger>
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
        </ScrollTrigger>
      </div>
      <div className=" pb-[190px]">
        <Slider {...settings}>
          {infoBoss.map((user, index) => (
            <div
              key={index}
              className="flex flex-col gap-[32px]"
            >
              <div className="bg-[#f5f5f5] flex justify-center pt-[39px]">
                <LazyLoadImage
                  src={user.img}
                  alt="user"
                  effect="blur"
                  className="w-[300px] h-[500px]"
                />
              </div>
              <div className="flex flex-col gap-4 pt-[32px]">
                <div className="flex flex-col">
                  <span className="text-[32px] font-medium leading-[30px] tracking-[1.28px]">
                    {user.name}
                  </span>
                  <span className="text-[16px] font-normal leading-[24px] mt-2">
                    Managing Director
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <a href={`${user.fb}`}>
                    <box-icon
                      type="logo"
                      name="facebook"
                      size="24px"
                    ></box-icon>
                  </a>
                  <a href={`${user.ig}`}>
                    <box-icon
                      name="instagram"
                      type="logo"
                      size="24px"
                    ></box-icon>
                  </a>
                  <a href="#">
                    <box-icon
                      type="logo"
                      name="twitter"
                      size="24px"
                    ></box-icon>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <Featured />
      <Footer />
      <ToastContainer />
    </div>
  );
};
export default About;
