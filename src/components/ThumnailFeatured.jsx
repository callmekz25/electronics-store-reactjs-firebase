import { LazyLoadImage } from "react-lazy-load-image-component";
export const ThumnailFeatured = ({ data, style, key }) => {
    return (
        <div
            className={` ${style} bg-[#000000] px-[20px] rounded relative`}
            key={key}
        >
            <LazyLoadImage
                src={data.img}
                alt=""
                effect="blurr"
                className="absolute h-full w-full object-cover left-0  top-0 z-0"
            />
            <div className="absolute left-0 bottom-0 flex flex-col gap-[16px] z-10 pb-[32px] w-[252px] px-[30px]">
                <h1 className="text-[24px] font-medium leading-[24px] tracking-[0.72px] text-white">
                    {data.name}
                </h1>
                <span className="text-[14px] font-normal leading-[21px] text-white">
                    {data.desc}
                </span>
                <button className="w-fit text-[16px] font-medium leading-[24px] border-b z-20 relative">
                    <span className="text-white">{data.shop}</span>
                </button>
            </div>
        </div>
    );
};
