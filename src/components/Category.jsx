import Phone from "../Assets/Category/Category-CellPhone.webp";
import Computer from "../Assets/Category/Category-Computer.webp";
import SmartWatch from "../Assets/Category/Category-SmartWatch.webp";
import Camera from "../Assets/Category/Category-Camera.webp";
import HeadPhone from "../Assets/Category/Category-Headphone.webp";
import Gaming from "../Assets/Category/Category-Gamepad.webp";
import { Link } from "react-router-dom";
import { BoxCategory } from "./BoxCategory";
export const Category = () => {
    return (
        <div className="py-[80px] px-[135px] border-b border-[gray-500]">
            <div className="flex flex-col gap-[24px]">
                <div className="flex items-center gap-[16px]">
                    <div className="w-[20px] h-[40px] rounded-md bg-[#DB4444]"></div>
                    <span className="text-[16px] text-[#DB4444] font-semibold leading-[20px]">
                        Categories
                    </span>
                </div>
                <h1 className="text-[36px] font-semibold leading-[48px] tracking-[1.44px]">
                    Browse By Category
                </h1>
            </div>
            <div className="pt-[60px] grid grid-cols-6 gap-[30px]">
                <Link to="/phones">
                    <BoxCategory
                        name="Phones"
                        img={Phone}
                    />
                </Link>
                <Link to="/laptops">
                    <BoxCategory
                        name="Laptops"
                        img={Computer}
                    />
                </Link>
                <Link>
                    <BoxCategory
                        name="SmartWatch"
                        img={SmartWatch}
                    />
                </Link>
                <Link>
                    <BoxCategory
                        name="Camera"
                        img={Camera}
                        style="bg-[#DB4444] text-white"
                    />
                </Link>
                <Link>
                    <BoxCategory
                        name="HeadPhones"
                        img={HeadPhone}
                    />
                </Link>
                <Link>
                    <BoxCategory
                        name="Gaming"
                        img={Gaming}
                    />
                </Link>
            </div>
        </div>
    );
};
