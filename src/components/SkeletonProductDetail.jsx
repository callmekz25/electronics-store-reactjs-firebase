import Skeleton from "react-loading-skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="product-detail lg:px-[100px]">
      <div className="py-[40px]">
        <Skeleton width={300} />
      </div>
      <div className="grid grid-cols-3 py-[80px]">
        {/* Skeleton for the image */}
        <div className="product-image col-span-2">
          <Skeleton
            width={850}
            height={380}
          />
          <div className="mt-10">
            <Skeleton
              width={800}
              height={150}
            />
          </div>
        </div>
        {/* Skeleton for the product details */}
        <div className="product-info col-span-1">
          <div className="price ">
            <Skeleton width={100} />
          </div>
          <div className="mt-4">
            <Skeleton width={100} />
          </div>
          <div className="specs mt-7">
            <Skeleton width={350} />
            <div className="mt-3">
              <Skeleton
                className="w-full"
                height={50}
              />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton
              width={130}
              height={35}
            />
          </div>
          {/* <div className="flex items-center  justify-between mt-4">
            <Skeleton
              width={170}
              height={35}
            />
            <Skeleton
              width={170}
              height={35}
            />
          </div> */}
        </div>
      </div>
      <div className="grid-cols-3 mt-10 mb-[200px]">
        <div className="col-span-2">
          <Skeleton
            className="w-full"
            height={200}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
