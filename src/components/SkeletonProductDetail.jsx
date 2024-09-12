import Skeleton from "react-loading-skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="product-detail">
      <div className="py-[80px]">
        <Skeleton width={300} />
      </div>
      <div className="grid grid-cols-3 gap-[40px] py-[80px]">
        {/* Skeleton for the image */}
        <div className="product-image col-span-2">
          <Skeleton
            height={380}
            width={800}
          />
          <div className="mt-10">
            <Skeleton
              height={150}
              width={800}
            />
          </div>
        </div>
        {/* Skeleton for the product details */}
        <div className="product-info col-span-1">
          <h2>
            <Skeleton width={250} />
          </h2>
          <div className="price mt-4">
            <Skeleton width={100} />
          </div>
          <div className="mt-4">
            <Skeleton width={100} />
          </div>
          <div className="specs mt-7">
            <Skeleton width={350} />
            <div className="mt-3">
              <Skeleton
                width={350}
                height={230}
              />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton
              width={130}
              height={35}
            />
          </div>
          <div className="flex items-center  justify-between mt-4">
            <Skeleton
              width={170}
              height={35}
            />
            <Skeleton
              width={170}
              height={35}
            />
          </div>
          <div className="mt-5">
            <Skeleton
              width={100}
              height={30}
            />
          </div>
        </div>
      </div>
      <div className="grid-cols-3 mt-10">
        <div className="col-span-2">
          <Skeleton
            width={800}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
