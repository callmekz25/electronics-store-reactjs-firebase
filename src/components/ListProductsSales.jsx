import { CardProductsStandard } from "./CardProductsStandard";
import { useEffect } from "react";
export const ListProductsSales = ({ products }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    });
    // Tùy sp có link khác nhau
    const getProductPath = (category) => {
        if (category === "phone") {
            return "product-details-phones";
        }
        if (category === "laptop") {
            return "product-details-laptops";
        }
    };
    return (
        <div className="">
            <div className="grid grid-cols-4 gap-x-[30px] gap-y-[60px]">
                {products.map((product) => {
                    return (
                        <CardProductsStandard
                            path={`${getProductPath(product.cate)}`}
                            data={product}
                        />
                    );
                })}
            </div>
        </div>
    );
};
