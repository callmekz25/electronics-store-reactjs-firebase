import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { useState, useEffect } from "react";
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
import "react-lazy-load-image-component/src/effects/blur.css";
import { ToastContainer } from "react-toastify";
import ship from "../Assets/Featured/icon-delivery.svg";
import service from "../Assets/Featured/Icon-Customer service.svg";
import tick from "../Assets/Featured/shield-tick.svg";

const About = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
    };

    const [infoBoss, setInfoBoss] = useState([]);

    const dbRef = ref(database);

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
        <>
            <Nav />
            <div className="pl-[135px] pb-[140px]">
                <div className="flex items-center gap-2 py-[80px]">
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
                <div className="flex items-center gap-[75px] pb-[140px]">
                    <div className="flex flex-col gap-[40px]">
                        <h1 className="lg:text-[54px] font-semibold lg:leading-[64px] lg:tracking-[3.24px]">
                            Our Story
                        </h1>
                        <div className="flex flex-col gap-[24px] text-[16px] font-normal leading-[26px]">
                            <p>
                                Launced in 2015, Exclusive is South Asia’s
                                premier online shopping makterplace with an
                                active presense in Bangladesh. Supported by wide
                                range of tailored marketing, data and service
                                solutions, Exclusive has 10,500 sallers and 300
                                brands and serves 3 millioons customers across
                                the region.
                            </p>
                            <p>
                                Exclusive has more than 1 Million products to
                                offer, growing at a very fast. Exclusive offers
                                a diverse assotment in categories ranging from
                                consumer.
                            </p>
                        </div>
                    </div>
                    <div className="">
                        <LazyLoadImage
                            src={Thum}
                            alt=""
                            effect="blur"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <div className="px-[135px] grid grid-cols-4 gap-[34px] pb-[140px]">
                <div className="flex flex-col items-center justify-center gap-[24px] border-2  border-[gray-500] rounded py-[30px]">
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
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[32px] font-semibold leading-[30px] tracking-[1.28px]">
                            10.5k
                        </span>
                        <span className="text-[16px] font-normal leading-[24px]">
                            Sallers active our site
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-[24px] shadow-md rounded py-[30px] bg-[#db4444] text-white">
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
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[32px] font-semibold leading-[30px] tracking-[1.28px]">
                            33k
                        </span>
                        <span className="text-[16px] font-normal leading-[24px]">
                            Mopnthly Produduct Sale
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-[24px] border-2  border-[gray-500] rounded py-[30px]">
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
                    <div className="flex flex-col items-center gap-2 ">
                        <span className="text-[32px] font-semibold leading-[30px] tracking-[1.28px]">
                            45.5k
                        </span>
                        <span className="text-[16px] font-normal leading-[24px]">
                            Customer active in our site
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-[24px] border-2  border-[gray-500] rounded py-[30px]">
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
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[32px] font-semibold leading-[30px] tracking-[1.28px]">
                            25k
                        </span>
                        <span className="text-[16px] font-normal leading-[24px]">
                            Anual gross sale in our site
                        </span>
                    </div>
                </div>
            </div>
            <div className="px-[135px] pb-[190px]">
                <Slider {...settings}>
                    {infoBoss.map((user, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-[32px]"
                        >
                            <div className="bg-[#f5f5f5] flex justify-center pt-[39px]">
                                <LazyLoadImage
                                    src={user.img}
                                    alt=""
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
            <div className="px-[135px] pb-[140px] flex items-center justify-center">
                <div className="flex items-center gap-[88px]">
                    <div className="flex flex-col items-center gap-[24px]">
                        <div className="size-[80px] rounded-full bg-[#c1c1c1] flex items-center justify-center">
                            <div className="size-[55px] rounded-full bg-black flex items-center justify-center">
                                <LazyLoadImage
                                    effect="blur"
                                    src={ship}
                                    alt=""
                                    className="size-[40px] object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[20px] font-semibold leading-[28px]">
                                FREE AND FAST DELIVERY
                            </span>
                            <span className="text-[14px] font-normal leading-[21px]">
                                Free delivery for all orders over $140
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-[24px]">
                        <div className="size-[80px] rounded-full bg-[#c1c1c1] flex items-center justify-center">
                            <div className="size-[55px] rounded-full bg-black flex items-center justify-center">
                                <LazyLoadImage
                                    effect="blur"
                                    src={service}
                                    alt=""
                                    className="size-[40px] object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[20px] font-semibold leading-[28px]">
                                24/7 CUSTOMER SERVICE
                            </span>
                            <span className="text-[14px] font-normal leading-[21px]">
                                Friendly 24/7 customer support
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-[24px]">
                        <div className="size-[80px] rounded-full bg-[#c1c1c1] flex items-center justify-center">
                            <div className="size-[55px] rounded-full bg-black flex items-center justify-center">
                                <LazyLoadImage
                                    effect="blur"
                                    src={tick}
                                    alt=""
                                    className="size-[40px] object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[20px] font-semibold leading-[28px]">
                                MONEY BACK GUARANTEE
                            </span>
                            <span className="text-[14px] font-normal leading-[21px]">
                                We reurn money within 30 days
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </>
    );
};
export default About;
