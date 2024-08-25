import { CardProductsStandard } from "./CardProductsStandard";

const ExploreProducts = () => {
    return (
        <div className="px-[135px]">
            <div className="flex flex-col gap-[24px]">
                <div className="flex items-center gap-[16px]">
                    <div className="w-[20px] h-[40px] rounded-md bg-[#DB4444]"></div>
                    <span className="text-[16px] text-[#DB4444] font-semibold leading-[20px]">
                        Our Products
                    </span>
                </div>
                <h1 className="text-[36px] font-semibold leading-[48px] tracking-[1.44px]">
                    Explore Our Products
                </h1>
            </div>
            <div className="py-[60px] grid grid-cols-4 gap-x-[30px] gap-y-[60px]">
                {/* {products.map((product, index) => {
                    return (
                        <div key={index}>
                            <CardProductsStandard
                                data={product}
                                key={product.id}
                            />
                        </div>
                    );
                })} */}
            </div>
            <div className="flex items-center justify-center ">
                <button className="bg-[#DB4444] rounded flex items-center justify-center py-[16px] px-[48px]">
                    <span className="text-white text-[16px] font-medium leading-[24px]">
                        View All Products
                    </span>
                </button>
            </div>
        </div>
    );
};
export default ExploreProducts;
