import Skeleton from "react-loading-skeleton";
const SkeletonCart = () => {
  return (
    <div className="flex flex-col gap-[40px] pb-[140px] lg:px-[100px]">
      <div className="py-[80px]"></div>
      <div className="flex items-center justify-between px-[40px] py-[24px]  shadow-cart">
        <Skeleton
          containerClassName="w-full"
          height={30}
        />
      </div>
      <div className="flex items-center  gap-10 px-[40px] py-[24px] shadow-cart">
        <Skeleton
          width={200}
          height={70}
        />

        <Skeleton
          height={15}
          containerClassName="w-full"
          count={3}
        />
      </div>
      <div className="flex items-center  gap-10 px-[40px] py-[24px] shadow-cart">
        <Skeleton
          width={200}
          height={70}
        />

        <Skeleton
          height={15}
          containerClassName="w-full"
          count={3}
        />
      </div>
      <div className="flex items-center  gap-10 px-[40px] py-[24px] shadow-cart">
        <Skeleton
          width={200}
          height={70}
        />

        <Skeleton
          height={15}
          containerClassName="w-full"
          count={3}
        />
      </div>
      <div className="flex items-center  gap-10 px-[40px] py-[24px] shadow-cart">
        <Skeleton
          width={200}
          height={70}
        />

        <Skeleton
          height={15}
          containerClassName="w-full"
          count={3}
        />
      </div>
    </div>
  );
};

export default SkeletonCart;
