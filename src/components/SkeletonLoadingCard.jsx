const SkeletonCard = () => {
  return (
    <div className="p-5 lg:p-6 border rounded-lg animate-pulse">
      <div className="bg-[#ebebeb] h-48 w-full mb-7 rounded-md mt-[50px]"></div>
      <div className="bg-[#ebebeb] h-6 w-3/4 mb-4 rounded"></div>
      <div className="bg-[#ebebeb] h-6 w-1/2 rounded mb-3"></div>
      <div className="bg-[#ebebeb] h-6 w-1/2 rounded"></div>
    </div>
  );
};
export default SkeletonCard;
