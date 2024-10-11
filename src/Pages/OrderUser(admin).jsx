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
        className={`bg-[#f0f1f3]  px-3 py-5 col-span-5   
                }`}
      >
        <div className="py-[50px] px-[30px]">
          <div className="flex flex-col gap-4 py-[30px]">
            <div className="flex items-center gap-2">
              <span className="text-[24px] font-medium">Order ID:</span>
              <span className="text-[18px] font-medium">
                {ordersUser.orderId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[16px]  font-normal">
              <span>Date Time: {ordersUser.createdAt}</span>
              <span>{ordersUser.time}</span>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-[30px]">
            <div className="col-span-4  bg-[#ffff] rounded-lg p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <span className="text-[19px] font-semibold">Order Items</span>
              </div>
              {ordersUser.products.map((product) => {
                return (
                  <div
                    className="flex justify-between"
                    key={product.productId}
                  >
                    <div className="flex  gap-3">
                      <div className="flex items-center justify-center rounded-lg bg-[#f0f1ef] p-3">
                        <LazyLoadImage
                          src={product.image}
                          alt=""
                          effect="blur"
                          className="size-[50px] object-contain"
                        ></LazyLoadImage>
                      </div>
                      <div className="flex flex-col justify-between">
                        <span className="text-[16px] font-medium">
                          {product.name}
                        </span>
                        <span className="text-[14px]">
                          Quantity: {product.quantity}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[15px] text-gray-500 font-medium">
                            {product.colors}
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
                          <span className="text-[16px]">${product.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="col-span-2 bg-[#ffff] rounded-lg p-4 h-fit">
              <div className="flex flex-col gap-4 justify-between h-full">
                <span className="text-[19px] font-semibold">Customer</span>
                <div className="flex items-center gap-2 text-[15px] ">
                  <UserIcon className="size-[20px]" />
                  <span className="">{ordersUser.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[15px] ">
                  <EnvelopeIcon className="size-[20px]" />
                  <span>{ordersUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[15px] ">
                  <PhoneIcon className="size-[20px]" />
                  <span>{ordersUser.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[15px] ">
                  <MapPinIcon className="size-[20px]" />
                  <span>{ordersUser.address}</span>
                </div>
              </div>
            </div>
            <div className="bg-[#ffff] rounded-lg p-4 col-span-4">
              <span className="text-[19px] font-semibold">Order Summary</span>
              <div className="flex flex-col gap-3 pt-6">
                <div className="flex items-center justify-between text-[15px] text-gray-600 font-normal">
                  <span>Subtotal</span>
                  <div className="flex items-center gap-[150px] justify-start text-[15px]">
                    <span>{ordersUser.products.length} item</span>
                    <span>${Math.round(ordersUser.total * 100) / 100}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[15px] text-gray-600 font-normal">
                  <span>Shipping</span>
                  <div className="flex items-center gap-[150px] text-[15px]">
                    <span>Free shipping</span>
                    <span>$0.00</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[15px] font-semibold">
                  <span>Total</span>
                  <span>${Math.round(ordersUser.total * 100) / 100}</span>
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
