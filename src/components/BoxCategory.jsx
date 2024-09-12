import { LazyLoadImage } from "react-lazy-load-image-component";
export const BoxCategory = ({ name, img, style, delay }) => {
  return (
    <div
      className={`border-2 border-[gray-500] rounded flex items-center justify-center ${style} py-[38px]  hover:border-[#0077ed] transition-all duration-200 hover:cursor-pointer `}
      data-aos="fade-up"
      data-aos-duration="1000"
      data-aos-delay={`${delay}`}
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
