import { LazyLoadImage } from "react-lazy-load-image-component";
export const BoxCategory = ({ name, img, style }) => {
    return (
        <div
            className={`border-2 border-[gray-500] rounded flex items-center justify-center ${style} py-[25px] overflow-hidden hover:border-red-400 transition-all duration-400 hover:cursor-pointer `}
        >
            <div className="flex flex-col gap-[16px] items-center">
                <LazyLoadImage
                    src={img}
                    alt=""
                    className="size-[56px] object-cover"
                    effect="blur"
                />
                <span>{name}</span>
            </div>
        </div>
    );
};
