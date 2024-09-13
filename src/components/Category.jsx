import Phone from "../Assets/Category/Category-CellPhone.webp";
import Computer from "../Assets/Category/Category-Computer.webp";
import SmartWatch from "../Assets/Category/Category-SmartWatch.webp";
import HeadPhone from "../Assets/Category/Category-Headphone.webp";
import Gaming from "../Assets/Category/Category-Gamepad.webp";
import { Link } from "react-router-dom";
import { BoxCategory } from "./BoxCategory";
export const Category = () => {
  return (
    <div className="lg:py-[80px] py-[40px] lg:px-0 px-[20px] border-b border-[gray-500]">
      <div className="flex flex-col gap-[24px]">
        <div
          className="flex items-center gap-[16px]"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className="w-[20px] h-[40px] rounded-md bg-black"></div>
          <span className="text-[16px] text-black font-semibold leading-[20px]">
            Categories
          </span>
        </div>
        <h1
          className="lg:text-[36px] text-[25px] font-semibold leading-[48px] tracking-[1.44px]"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          Browse By Category
        </h1>
      </div>
      <div className="pt-[60px] grid lg:grid-cols-5 grid-cols-2 lg:gap-[30px] gap-[20px]">
        <Link to="/phones">
          <BoxCategory
            name="Phones"
            img={Phone}
            delay="100"
          />
        </Link>
        <Link to="/laptops">
          <BoxCategory
            name="Laptops"
            img={Computer}
            delay="150"
          />
        </Link>
        <Link>
          <BoxCategory
            name="SmartWatch"
            img={SmartWatch}
            delay="200"
          />
        </Link>

        <Link>
          <BoxCategory
            name="HeadPhones"
            img={HeadPhone}
            delay="250"
          />
        </Link>
        <Link>
          <BoxCategory
            name="Gaming"
            img={Gaming}
            delay="300"
          />
        </Link>
      </div>
    </div>
  );
};
