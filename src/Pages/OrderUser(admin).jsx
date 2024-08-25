import { useLocation } from "react-router-dom";
// Icon
import { PhoneIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import SideBar from "../components/SideBar";
const OrdersUser = () => {
    const location = useLocation();
    const { ordersUser } = location.state || {};

    return (
        <div className="grid grid-cols-6">
            <SideBar isActive={"orders"} />
            <div
                className={`bg-[#ffffff]  px-3 py-5 col-span-5   
                }`}
            >
                <div className="py-[50px] px-[30px]">
                    <div className="flex flex-col gap-4 py-[30px]">
                        <div className="flex items-center gap-2">
                            <span className="text-[27px] font-medium">
                                Order ID:
                            </span>
                            <span className="text-[20px] font-medium">
                                {ordersUser.orderId}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[16px] text-gray-500 font-normal">
                            <span>{ordersUser.createdAt}</span>
                            <span>{ordersUser.time}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-6 gap-[30px]">
                        <div className="col-span-4 border-2 border-gray-200 rounded-lg p-4 flex flex-col gap-4">
                            <div className="flex flex-col gap-4">
                                <span className="text-[19px] font-semibold">
                                    Order Item
                                </span>
                                <div className="flex items-center justify-center bg-orange-200 px-3 py-1 w-fit rounded-full">
                                    <span className="text-[13px] text-orange-500 font-medium">
                                        {ordersUser.status}
                                    </span>
                                </div>
                            </div>
                            {ordersUser.products.map((product) => {
                                return (
                                    <div className="flex justify-between">
                                        <div className="flex  gap-3">
                                            <div className="flex items-center justify-center rounded-lg bg-[#e3ebde] p-3">
                                                <LazyLoadImage
                                                    src={product.image}
                                                    alt=""
                                                    effect="blur"
                                                    className="size-[70px] object-contain"
                                                ></LazyLoadImage>
                                            </div>
                                            <div className="flex flex-col justify-between">
                                                <span className="text-[15px] text-gray-500 font-medium">
                                                    {product.cate}
                                                </span>
                                                <span className="text-[19px] font-medium">
                                                    {product.name}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[15px] text-gray-500 font-medium">
                                                        {product.color}
                                                    </span>
                                                    <div
                                                        className={`size-[25px] rounded-md  color-${product.color}`}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-[15px]">
                                                        Price:
                                                    </span>
                                                    <span>
                                                        ${product.price} x
                                                        {product.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="col-span-2 border-2 border-gray-200 rounded-lg p-4 h-fit">
                            <div className="flex flex-col gap-4 justify-between h-full">
                                <span className="text-[19px] font-semibold">
                                    Customer
                                </span>
                                <div className="flex items-center gap-2 text-[15px] text-gray-500">
                                    <UserIcon className="size-[20px]" />
                                    <span className="">{ordersUser.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[15px] text-gray-500">
                                    <EnvelopeIcon className="size-[20px]" />
                                    <span>{ordersUser.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[15px] text-gray-500">
                                    <PhoneIcon className="size-[20px]" />
                                    <span>{ordersUser.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[15px] text-gray-500">
                                    <MapPinIcon className="size-[20px]" />
                                    <span>{ordersUser.address}</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-gray-200 border-2 rounded-lg p-4 col-span-4">
                            <span className="text-[19px] font-semibold">
                                Order Summary
                            </span>
                            <div className="flex flex-col gap-3 pt-6">
                                <div className="flex items-center justify-between text-[17px] text-gray-600 font-normal">
                                    <span>Subtotal</span>
                                    <div className="flex items-center gap-[150px] justify-start">
                                        <span>
                                            {ordersUser.products.length} item
                                        </span>
                                        <span>${ordersUser.total}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-[17px] text-gray-600 font-normal">
                                    <span>Shipping</span>
                                    <div className="flex items-center gap-[150px]">
                                        <span>Free shipping</span>
                                        <span>$0.00</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-[17px] font-semibold">
                                    <span>Total</span>
                                    <span>${ordersUser.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default OrdersUser;
