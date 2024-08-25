import Product from "../Assets/SpecialProduct/Product.webp";
import { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
export const SpecialProduct = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date("2024-12-31") - +new Date();

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (20000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    return (
        <div className="px-[135px] py-[80px]">
            <div className="h-[500px] w-full bg-black relative flex items-center">
                <div className="absolute w-full h-full flex items-center justify-between px-[56px] py-[70px] gap-[30px]">
                    <div className="flex flex-col  gap-[32px] ">
                        <span className="text-[16px] font-semibold leading-[20px] text-[#00FF66]">
                            Categories
                        </span>
                        <h1 className="text-[48px] font-medium leading-[60px] tracking-[1.92px] text-white">
                            Enhance Your Music Experience
                        </h1>
                        <div className="flex items-center gap-[24px]">
                            <div className="bg-white rounded-full flex items-center justify-center py-[10px] px-[15px] size-[62px]">
                                <div className="flex flex-col items-center">
                                    <span className="text-[16px] font-semibold leading-[20px]">
                                        {timeLeft.days || "00"}
                                    </span>
                                    <span className="text-[11px] font-normal leading-[18px]">
                                        Days
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white rounded-full flex items-center justify-center py-[10px] px-[15px] size-[62px]">
                                <div className="flex flex-col items-center">
                                    <span className="text-[16px] font-semibold leading-[20px]">
                                        {timeLeft.hours || "00"}
                                    </span>
                                    <span className="text-[11px] font-normal leading-[18px]">
                                        Hours
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white rounded-full flex items-center justify-center py-[10px] px-[15px] size-[62px]">
                                <div className="flex flex-col items-center">
                                    <span className="text-[16px] font-semibold leading-[20px]">
                                        {timeLeft.minutes || "00"}
                                    </span>
                                    <span className="text-[11px] font-normal leading-[18px]">
                                        Minutes
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white rounded-full flex items-center justify-center py-[10px] px-[15px] size-[62px]">
                                <div className="flex flex-col items-center">
                                    <span className="text-[16px] font-semibold leading-[20px]">
                                        {timeLeft.seconds || "00"}
                                    </span>
                                    <span className="text-[11px] font-normal leading-[18px]">
                                        Seconds
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button className="px-[48px] py-[16px] rounded bg-[#00FF66] text-white text-[16px] font-medium leading-[24px] flex items-center justify-center w-fit">
                            <span>Buy Now!</span>
                        </button>
                    </div>

                    <LazyLoadImage
                        effect="blur"
                        src={Product}
                        alt=""
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
};
