import { ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Error } from "../Pages/Error";
import { CardProductsStandard } from "./CardProductsStandard";

export const Today = () => {
    const [products, setProducts] = useState([]);
    const dbRef = ref(database);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const laptopsSnapshot = await get(
                    child(dbRef, "all-products/laptops")
                );
                let laptopsData = [];
                if (laptopsSnapshot.exists()) {
                    laptopsData = laptopsSnapshot.val();
                } else {
                    console.log("No data available for laptops");
                }

                const phonesSnapshot = await get(
                    child(dbRef, "all-products/phones")
                );
                let phonesData = [];
                if (phonesSnapshot.exists()) {
                    phonesData = phonesSnapshot.val();
                } else {
                    console.log("No data available for phones");
                }

                // Đẩy dữ liệu từ 2 api vào 1 mảng
                const combinedData = [...laptopsData, ...phonesData];

                setProducts(combinedData);
            } catch (error) {
                console.error("Error fetching data:", error);
                return <Error />;
            }
        };

        fetchData();
    }, [dbRef]);
    let timeLeft = {
        day: "00",
    };
    // const calculateTimeLeft = () => {
    //     const difference = +new Date("2024-12-31") - +new Date();

    //     let timeLeft = {};

    //     if (difference > 0) {
    //         timeLeft = {
    //             days: Math.floor(difference / (20000 * 60 * 60 * 24)),
    //             hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    //             minutes: Math.floor((difference / 1000 / 60) % 60),
    //             seconds: Math.floor((difference / 1000) % 60),
    //         };
    //     }
    //     return timeLeft;
    // };

    // const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setTimeLeft(calculateTimeLeft());
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, []);
    const getProductPath = (category) => {
        if (category === "phone") {
            return "product-details-phones";
        }
        if (category === "laptop") {
            return "product-details-laptops";
        }
    };
    return (
        <div className="pt-[140px] px-[135px] pb-[60px] border-b border-[gray-500]">
            <div className="flex items-end gap-[90px]">
                <div className="flex flex-col gap-[24px]">
                    <div className="flex items-center gap-[16px]">
                        <div className="w-[20px] h-[40px] rounded-md bg-[#DB4444]"></div>
                        <span className="text-[16px] text-[#DB4444] font-semibold leading-[20px]">
                            Today's
                        </span>
                    </div>
                    <h1 className="text-[36px] font-semibold leading-[48px] tracking-[1.44px]">
                        Flash Sales
                    </h1>
                </div>
                <div className="flex items-center gap-[20px]    ">
                    <div className="flex flex-col gap-2">
                        <span className="text-[12px] font-medium leading-[18px]">
                            Days
                        </span>
                        <span className="text-[32px] font-bold leading-[30px] tracking-[1.28px]">
                            {timeLeft.days || "00"}
                        </span>
                    </div>
                    <div className="">:</div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[12px] font-medium leading-[18px]">
                            Hours
                        </span>
                        <span className="text-[32px] font-bold leading-[30px] tracking-[1.28px]">
                            {timeLeft.hours || "00"}
                        </span>
                    </div>
                    <div className="">:</div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[12px] font-medium leading-[18px]">
                            Minutes
                        </span>
                        <span className="text-[32px] font-bold leading-[30px] tracking-[1.28px]">
                            {timeLeft.minutes || "00"}
                        </span>
                    </div>
                    <div className="">:</div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[12px] font-medium leading-[18px]">
                            Seconds
                        </span>
                        <span className="text-[32px] font-bold leading-[30px] tracking-[1.28px]">
                            {timeLeft.seconds || "00"}
                        </span>
                    </div>
                </div>
            </div>
            <div className="py-[60px] grid grid-cols-4 gap-[30px]">
                {products.map((product) => {
                    if (product.isSale) {
                        return (
                            <CardProductsStandard
                                key={product.id}
                                data={product}
                                path={`${getProductPath(product.cate)}`}
                            />
                        );
                    }
                })}
            </div>
            <div className="flex items-center justify-center pt-[40px]">
                <Link
                    className="bg-[#DB4444] rounded flex items-center justify-center py-[16px] px-[48px]"
                    to="/sales"
                >
                    <span className="text-white text-[16px] font-medium leading-[24px]">
                        View All Products
                    </span>
                </Link>
            </div>
        </div>
    );
};
