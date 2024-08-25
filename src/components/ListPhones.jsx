import { CardProductsStandard } from "./CardProductsStandard";
export const ListPhones = ({ filteredProducts }) => {
    return (
        <>
            {filteredProducts.length > 0 ? (
                <div className={`grid grid-cols-3 gap-x-[30px] gap-y-[60px]`}>
                    {filteredProducts.map((product, index) => {
                        return (
                            <div
                                className=""
                                key={index}
                            >
                                <CardProductsStandard data={product} />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-start justify-center w-full h-full py-[50px]">
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-[28px] font-medium leading-[24px]">
                            Sorry we couldn't find any matches
                        </span>
                        <span className="text-[16px] text-gray-400 font-normal">
                            Please try find with another product
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};
