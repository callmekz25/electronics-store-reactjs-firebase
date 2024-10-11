import { InboxIcon } from "@heroicons/react/24/outline";
const NoData = ({ title }) => {
  return (
    <div className="flex items-center justify-center py-40 bg-[#ffff] rounded-xl">
      <div className="flex flex-col gap-2 justify-center items-center">
        <InboxIcon className="size-12 text-gray-300" />
        <span className="text-gray-400 text-[16px]">{title}</span>
      </div>
    </div>
  );
};

export default NoData;
