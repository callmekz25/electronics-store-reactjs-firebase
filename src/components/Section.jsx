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
    <div className="flex px-[20px] lg:px-0">
      <div className="w-full pt-[40px] ">
        <div className=" bg-black relative overflow-hidden flex items-center rounded-2xl">
          <div
            className="w-full h-full z-40 flex items-center"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {slides.map((slide, index) => {
              return (
                <div
                  className={`w-full flex-shrink-0 flex  items-center justify-between lg:px-[64px] px-[20px] py-[20px] lg:flex-row flex-col gap-4 ${
                    index === currentIndex ? "fade-up" : ""
                  }`}
                  key={index}
                >
                  <div className="text-white flex flex-col lg:gap-[20px]  justify-center w-full ">
                    <div className="flex items-center gap-[24px]">
                      <LazyLoadImage
                        src={AppleIcon}
                        alt="IconApple"
                        effect="blur"
                        className="lg:size-[50px] size-[30px] object-cover"
                      />
                      <span className="lg:text-[16px] text-[14px] font-normal lg:leading-[24px]">
                        {slide.title}
                      </span>
                    </div>
                    <h3 className="lg:text-[48px] text-[25px] font-medium lg:leading-[60px] lg:tracking-[2px]">
                      {slide.description}
                    </h3>
                    <button className="flex items-center gap-2 w-fit border-b py-2">
                      <span className="lg:text-[20px] text-[14px]">
                        Shop now
                      </span>
                      <ArrowRightIcon className="size-[20px]" />
                    </button>
                  </div>
                  <div className="">
                    <LazyLoadImage
                      src={slide.image}
                      alt="banner"
                      effect="blur"
                      className="h-[200px] lg:h-[400px] w-[700px] object-contain"
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
