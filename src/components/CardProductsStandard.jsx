import { StarIcon as StarIconFilled } from "@heroicons/react/24/solid";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { query, getDocs, collection, where } from "firebase/firestore";
import { db } from "../firebase";
export const CardProductsStandard = ({ data }) => {
    const [reviewsData, setReviewsData] = useState([]);
    useEffect(() => {
        const showReviews = async () => {
            if (data) {
                const reviewsQuery = query(
                    collection(db, "Reviews"),
                    where("productID", "==", `${data.id}`)
                );
                const reviewsSnap = await getDocs(reviewsQuery);
                const reviewsData = reviewsSnap.docs.map((doc) => doc.data());
                setReviewsData(reviewsData);
            }
        };
        showReviews();
    }, [data]);
    // Hàm tính tổng số rate của từng user cho sản phẩm
    const totalRate = useMemo(() => {
        const total = reviewsData.reduce((result, reviewsData) => {
            return result + reviewsData.rate;
        }, 0);
        return total;
    }, [reviewsData]);
    // Tổng số rate trung bình của sản phẩm
    const totalAvgRate = useMemo(() => {
        return totalRate / reviewsData.length;
    }, [reviewsData]);
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(
                    <StarIconFilled
                        key={i}
                        className="w-4 h-4 text-yellow-500"
                    />
                );
            } else {
                stars.push(
                    <StarIconFilled
                        key={i}
                        className="w-4 h-4 text-gray-300"
                    />
                );
            }
        }
        return stars;
    };
    return (
        <Link to={`/dp/${data.name}/${data.id}`}>
            <div
                key={data.id}
                className="flex flex-col gap-[16px]"
            >
                <div className="bg-[#f5f5f5] flex items-center justify-center p-[50px] relative  hover:cursor-pointer rounded overflow-hidden card-products w-full h-[350px]">
                    <LazyLoadImage
                        src={data.img}
                        alt="ImageProduct"
                        effect="blur"
                        className="min-w-[185px] min-h-[185px] max-w-[250px] max-h-[250px] object-cover p-[30px]"
                    />
                    {data.sales ? (
                        <div className="bg-[#DB4444] flex items-center justify-center rounded py-[4px] px-[12px] absolute top-[12px] left-[12px]">
                            <span className="text-[12px] text-white font-normal leading-[18px]">
                                {data.sales}
                            </span>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-[16px] font-medium leading-[24px]">
                        {data.name}
                    </span>
                    <div className="flex items-center gap-3 text-[16px] font-medium leading-[24px]">
                        <span className="text-[#DB4444]">{`$${data.newPrice}`}</span>
                        <span
                            className={`line-through text-[14px] text-black opacity-50  ${
                                data.oldPrice ? "" : "hidden"
                            }`}
                        >
                            {`$${data.oldPrice}`}
                        </span>
                    </div>
                    <div
                        className={`flex items-center gap-2 ${
                            reviewsData.length === 0 ? "hidden" : "flex"
                        }`}
                    >
                        <div className={`flex items-center gap-1  `}>
                            {renderStars(totalAvgRate)}
                        </div>
                        <span
                            className={`text-[14px] font-semibold leading-[21px] opacity-50 
                            }`}
                        >
                            ({reviewsData.length || 0})
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
