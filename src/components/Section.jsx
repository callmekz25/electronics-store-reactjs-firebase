import AppleIcon from "../Assets/Section/iconApple.webp";
import Iphone from "../Assets/Section/banner.webp";
import {
    ArrowRightIcon,
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from "@heroicons/react/24/outline";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState, useEffect } from "react";

export const Section = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        {
            title: "iPhone 14 Series",
            description: "Up to 10% off Voucher",
            image: Iphone,
        },
        {
            title: "Another Product",
            description: "Up to 50% off Voucher",
            image: Iphone,
        },
    ];
    const prevSlide = () => {
        setCurrentIndex(0);
    };
    const nextSlide = () => {
        setCurrentIndex(1);
    };

    return (
        <div className="px-[135px] flex ">
            <div className="w-full  pt-[40px] ">
                <div className=" h-[352px] bg-black relative overflow-hidden flex items-center ">
                    <div
                        className="w-full h-full z-40 flex items-center"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                    >
                        {slides.map((slide, index) => {
                            return (
                                <div
                                    className={`w-full flex-shrink-0 flex items-center justify-between px-[64px] py-[20px] ${
                                        index === currentIndex ? "fade-up" : ""
                                    }`}
                                    key={index}
                                >
                                    <div className="text-white flex flex-col gap-[20px] justify-center w-full ">
                                        <div className="flex items-center gap-[24px]">
                                            <LazyLoadImage
                                                src={AppleIcon}
                                                alt="IconApple"
                                                effect="blur"
                                                className="size-[50px] object-cover"
                                            />
                                            <span className="text-[16px] font-normal leading-[24px]">
                                                {slide.title}
                                            </span>
                                        </div>
                                        <h3 className="text-[48px] font-medium leading-[60px] tracking-[2px]">
                                            {slide.description}
                                        </h3>
                                        <button className="flex items-center gap-2 w-fit border-b py-2">
                                            <span>Shop now</span>
                                            <ArrowRightIcon className="size-[20px]" />
                                        </button>
                                    </div>
                                    <div className="">
                                        <LazyLoadImage
                                            src={slide.image}
                                            alt="banner"
                                            effect="blur"
                                            className="h-[300px] w-[400px] object-contain"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 absolute bottom-[20px] right-[30px] z-50">
                        <button
                            className=" bg-white p-1 rounded-full flex items-center justify-center"
                            onClick={prevSlide}
                            disabled={currentIndex === 0 ? true : false}
                        >
                            <ArrowLongLeftIcon className={`size-[20px] `} />
                        </button>
                        <button
                            className=" bg-white p-1 rounded-full flex items-center justify-center"
                            onClick={nextSlide}
                            disabled={currentIndex === 1 ? true : false}
                        >
                            <ArrowLongRightIcon className={`size-[20px] `} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
