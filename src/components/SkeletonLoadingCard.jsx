const SkeletonCard = () => {
  return (
    <div className=" rounded-lg animate-pulse ml-10">
      <div className="bg-[#ebebeb] h-80 w-full mb-7 rounded-md"></div>
      <div className="bg-[#ebebeb] h-6 w-3/4 mb-4 rounded"></div>
      <div className="bg-[#ebebeb] h-6 w-1/2 rounded mb-3"></div>
      <div className="bg-[#ebebeb] h-6 w-1/2 rounded"></div>
    </div>
  );
};
export default SkeletonCard;
