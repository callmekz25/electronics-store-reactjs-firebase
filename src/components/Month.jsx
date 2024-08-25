import { CardProductsStandard } from "./CardProductsStandard";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { useState, useEffect } from "react";
export const Month = () => {
    const [products, setProducts] = useState([]);
    const dbRef = ref(database);
    useEffect(() => {
        get(child(dbRef, `product-month`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setProducts(data);
                } else {
                    console.log("No data available");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [dbRef]);
    return (
        <div className="py-[80px] px-[135px] ">
            <div className="flex items-end justify-between">
                <div className="flex flex-col gap-[24px]">
                    <div className="flex items-center gap-[16px]">
                        <div className="w-[20px] h-[40px] rounded-md bg-[#DB4444]"></div>
                        <span className="text-[16px] text-[#DB4444] font-semibold leading-[20px]">
                            This Month
                        </span>
                    </div>
                    <h1 className="text-[36px] font-semibold leading-[48px] tracking-[1.44px]">
                        Best Selling Products
                    </h1>
                </div>
                <div className="">
                    <button className="px-[48px] bg-[#DB4444] rounded py-[16px] text-[16px] text-white font-medium leading-[24px]">
                        <span>View All</span>
                    </button>
                </div>
            </div>
            <div className="py-[60px] grid grid-cols-4 gap-[30px]">
                {products.map((product, index) => {
                    return (
                        <div
                            className=""
                            key={index}
                        >
                            <CardProductsStandard data={product} />;
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
