import { ThumnailFeatured } from ".//ThumnailFeatured";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { useState, useEffect } from "react";
import ship from "../Assets/Featured/icon-delivery.svg";
import service from "../Assets/Featured/Icon-Customer service.svg";
import tick from "../Assets/Featured/shield-tick.svg";
import { LazyLoadImage } from "react-lazy-load-image-component";
const Featured = () => {
    const [products, setProducts] = useState([]);
    const dbRef = ref(database);
    useEffect(() => {
        get(child(dbRef, `featured`))
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
    }, []);
    return (
        <div className="py-[140px] px-[135px]">
            <div className="flex flex-col gap-[24px]">
                <div className="flex items-center gap-[16px]">
                    <div className="w-[20px] h-[40px] rounded-md bg-[#DB4444]"></div>
                    <span className="text-[16px] text-[#DB4444] font-semibold leading-[20px]">
                        Featured
                    </span>
                </div>
                <h1 className="text-[36px] font-semibold leading-[48px] tracking-[1.44px]">
                    New Arrival
                </h1>
            </div>
            <div className="pt-[60px] grid grid-cols-4 grid-rows-2 gap-[30px] h-[700px]">
                {products.map((product, index) => {
                    return (
                        <ThumnailFeatured
                            data={product}
                            key={index}
                            style={`${
                                index === 1 ? "row-span-2 col-span-2" : ""
                            } ${index === 2 ? "col-span-2 row-span-1 " : ""} 
                             ${index === 3 ? "col-span-1 row-span-1 " : ""}
                             ${index === 4 ? "col-span-1 row-span-1" : ""}`}
                        />
                    );
                })}
            </div>
            <div className="pt-[140px] flex items-center justify-center">
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
        </div>
    );
};
export default Featured;
