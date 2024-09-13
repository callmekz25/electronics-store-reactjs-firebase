import Skeleton from "react-loading-skeleton";
const SkeletonOrder = () => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 flex flex-col w-[836px]">
      <div className="">
        <Skeleton
          width={300}
          height={20}
        />
      </div>
      <div className="lg:mt-3">
        <Skeleton width={500} />
      </div>
      <div className="flex  gap-3 mt-2">
        <Skeleton
          width={130}
          height={100}
        />
        <div className="flex flex-col justify-between">
          <Skeleton
            width={180}
            height={20}
          />
          <Skeleton
            width={150}
            height={20}
          />
          <Skeleton
            width={100}
            height={20}
          />
        </div>
      </div>
    </div>
  );
};

export default SkeletonOrder;
