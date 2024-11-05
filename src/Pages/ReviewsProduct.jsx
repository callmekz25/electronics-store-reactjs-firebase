import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import UserIconNone from "../Assets/UserIcon/360_F_795951406_h17eywwIo36DU2L8jXtsUcEXqPeScBUq-removebg-preview.webp";
import { StarIcon as StarIconFilled } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Loading } from "../components/Loading";
import { UserContext } from "../Context/UserContext";
import { Error } from "./Error";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchReviewsByProductId,
  postReviewByProductId,
} from "../FetchAPI/FetchAPI";
import countingRate from "../Service/countingRate";
const PageReviews = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { productFind } = location.state || {};
  // Context user
  const { user } = useContext(UserContext);
  // State filter rate
  const [filterRate, setFilterRate] = useState(0);
  const [filteredReviewsData, setFilteredReviewsData] = useState(null);
  // Reviews
  const [isLogInToRate, setIsLogInToRate] = useState(false);
  const [isReview, setIsReview] = useState(false);
  const [starReview, setStarReview] = useState(0);
  const [comment, setComment] = useState(null);
  // State percent of star
  const [fiveStar, setFiveStar] = useState(0);
  const [fourStar, setFourStar] = useState(0);
  const [threeStar, setThreeStar] = useState(0);
  const [twoStar, setTwoStar] = useState(0);
  const [oneStar, setOneStar] = useState(0);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {
    data: reviewsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviews", productFind.id],
    queryFn: () => fetchReviewsByProductId(productFind.id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  // Mutation xử lí reviews
  const postReviewMutation = useMutation({
    mutationFn: () =>
      postReviewByProductId(productFind.id, user, starReview, comment),
    onSuccess: () => {
      queryClient.invalidateQueries("reviews", productFind.id);
      setIsReview(false);
      setStarReview(0);
    },
  });
  // Hàm xử lí gửi review của user
  const postReview = () => {
    if (user) {
      postReviewMutation.mutate();
    } else {
      setIsReview(true);
    }
  };

  // Hàm tính tổng số rate của từng user cho sản phẩm
  const totalRate = useMemo(() => {
    let total;
    if (reviewsData) {
      total = reviewsData.reduce((result, reviewsData) => {
        return result + reviewsData.rate;
      }, 0);
    }
    return total;
  }, [reviewsData]);
  // Tổng số rate trung bình của sản phẩm
  const totalAvgRate = useMemo(() => {
    if (reviewsData) {
      return totalRate / reviewsData.length;
    }
  }, [totalRate]);

  // Hàm render số sao đánh giá
  const renderStars = (rating, size) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <StarIconFilled
            key={i}
            className={` text-yellow-500 ${size}`}
            onClick={() => setStarReview(i)}
          />
        );
      } else {
        stars.push(
          <StarIconFilled
            key={i}
            className={` text-gray-300 ${size}`}
            onClick={() => setStarReview(i)}
          />
        );
      }
    }
    return stars;
  };
  // Chỉ tính lại logic khi có thêm dữ liệu reviews thay đổi
  const percentRate = useMemo(() => {
    let totalReviews;
    let count;
    if (reviewsData) {
      count = countingRate(reviewsData);
      totalReviews = reviewsData.length;
    }
    // Trả về object
    return {
      five:
        totalReviews > 0
          ? Math.round((count.five / totalReviews) * 100 * 100) / 100
          : 0,
      four:
        totalReviews > 0
          ? Math.round((count.four / totalReviews) * 100 * 100) / 100
          : 0,
      three:
        totalReviews > 0
          ? Math.round((count.three / totalReviews) * 100 * 100) / 100
          : 0,
      two:
        totalReviews > 0
          ? Math.round((count.two / totalReviews) * 100 * 100) / 100
          : 0,
      one:
        totalReviews > 0
          ? Math.round((count.one / totalReviews) * 100 * 100) / 100
          : 0,
    };
  }, [reviewsData]);
  // Dùng sideEffect để render lại UI khi đã tính lại logic
  useEffect(() => {
    setFiveStar(percentRate.five);
    setFourStar(percentRate.four);
    setThreeStar(percentRate.three);
    setTwoStar(percentRate.two);
    setOneStar(percentRate.one);
  }, [percentRate]);

  // Filter reviews theo rate user chọn
  useEffect(() => {
    if (reviewsData) {
      let filetered = reviewsData;
      if (filterRate === 5) {
        filetered = reviewsData.filter((reviewData) => reviewData.rate === 5);
      }
      if (filterRate === 4) {
        filetered = reviewsData.filter((reviewData) => reviewData.rate === 4);
      }
      if (filterRate === 3) {
        filetered = reviewsData.filter((reviewData) => reviewData.rate === 3);
      }
      if (filterRate === 2) {
        filetered = reviewsData.filter((reviewData) => reviewData.rate === 2);
      }
      if (filterRate === 1) {
        filetered = reviewsData.filter((reviewData) => reviewData.rate === 1);
      }
      if (filterRate === 0) {
        filetered = reviewsData;
      }

      setFilteredReviewsData(filetered);
    }
  }, [filterRate, reviewsData]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }
  return (
    <>
      <div className="lg:px-[100px] px-[20px] bg-white ">
        <Nav />
        {isLogInToRate && (
          <div className="overlay">
            <div className=" w-[550px] bg-white rounded-lg p-7 flex flex-col justify-between relative">
              <XMarkIcon
                className="size-[30px] absolute right-[15px] top-[15px] hover:cursor-pointer"
                onClick={() => setIsLogInToRate(false)}
              />
              <div className="">
                <h3 className="lg:text-[25px] font-medium text-center ">
                  You need to Log In
                </h3>
                <p className="py-7 lg:text-[18px] font-normal text-center">
                  If you want to rate this product you need to log in your
                  account
                </p>
              </div>
              <div className="flex items-center justify-end mt-10">
                <button
                  className="px-4 py-3 bg-blue-500 rounded-md flex items-center justify-center text-white font-medium text-[17px] outline-none w-full"
                  onClick={() => {
                    navigate("/log-in");
                  }}
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        )}
        {isReview && (
          <div className="overlay">
            <div className=" w-[650px] h-[620px] bg-white rounded-lg p-7 flex flex-col justify-between relative">
              <XMarkIcon
                className="size-[30px] absolute right-[15px] top-[15px] hover:cursor-pointer"
                onClick={() => setIsReview(false)}
              />
              <div className="">
                <h3 className="text-[20px] font-medium text-center ">
                  Review product
                </h3>
                <div className="flex flex-col items-center justify-center gap-4 py-5">
                  <LazyLoadImage
                    src={productFind.img[0]}
                    effect="blur"
                    className="size-[100px] object-contain"
                  />
                  <span className="text-[18px] font-medium">
                    {productFind.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {renderStars(starReview, "hover:cursor-pointer size-10")}
                  </div>
                  <textarea
                    type="text"
                    className="rounded-lg border-2 overflow-hidden border-gray-300 w-full h-[200px] p-3 text-start resize-none text-[15px] mt-4"
                    placeholder="Please share your thoughts about the product..."
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-4">
                <button
                  className="px-4 py-3 bg-blue-500 rounded-md flex items-center justify-center text-white font-medium text-[17px] outline-none w-full"
                  onClick={postReview}
                >
                  Send review
                </button>
              </div>
            </div>
          </div>
        )}
        <>
          <div className="flex items-center gap-2 py-[80px] ">
            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
              Home
            </span>
            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
              /
            </span>
            <span className="opacity-40 text-[14px] font-normal  leading-[21px]">
              Reviews
            </span>
            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
              /
            </span>
            <span className="text-black text-[14px] font-normal leading-[21px]">
              {productFind.name}
            </span>
          </div>
          <div className="pb-[150px]">
            <span className="text-[25px] font-semibold leading-[24px]">
              Reviews {productFind.name}
            </span>
            <div className="flex justify-center gap-[100px] py-[70px]">
              <div className="flex flex-col items-center justify-center gap-1">
                <img
                  src={productFind.img[0]}
                  alt=""
                  className="size-[150px] object-contain "
                />
                <span className="text-[23px] font-semibold leading-[24px]">
                  {productFind.name}
                </span>
                <div className="flex items-center gap-4 py-5">
                  <span className="text-[17px] font-semibold">
                    ${productFind.newPrice}
                  </span>
                  <span className="line-through text-[14px] text-gray-500">
                    ${productFind.oldPrice}
                  </span>
                  {productFind.sales ? (
                    <div className="bg-[#ffeaea] flex items-center justify-center rounded-full py-[4px] px-4  top-[12px] left-[12px]">
                      <span className="lg:text-[14px] text-[18px]  text-red-500 font-medium leading-[18px]">
                        -{productFind.sales}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-7 place-content-center">
                <div className="flex items-center gap-2">
                  <span className="text-[28px] leading-[28px] text-yellow-500 font-medium">
                    {Math.round(totalAvgRate * 10) / 10 || 0}
                  </span>
                  {renderStars(totalAvgRate, "size-5")}
                  <span className="text-[14px] text-blue-500 font-normal">
                    {reviewsData.length} Reviews
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span>5</span>
                    <span>
                      <StarIconFilled className="w-4 h-4 text-yellow-500" />
                    </span>
                    <div className="relative h-[6px] rounded-full bg-gray-300 w-[200px]">
                      <div
                        className=" absolute h-full rounded-full bg-yellow-500  top-0 left-0"
                        style={{ width: `${fiveStar}%` }}
                      ></div>
                    </div>
                    <span>{fiveStar}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>4</span>
                    <span>
                      <StarIconFilled className="w-4 h-4 text-yellow-500" />
                    </span>
                    <div className="relative h-[6px] rounded-full bg-gray-300 w-[200px]">
                      <div
                        className=" absolute h-full rounded-full bg-yellow-500 top-0 left-0"
                        style={{ width: `${fourStar}%` }}
                      ></div>
                    </div>
                    <span>{fourStar}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>3</span>
                    <span>
                      <StarIconFilled className="w-4 h-4 text-yellow-500" />
                    </span>
                    <div className="relative h-[6px] rounded-full bg-gray-300 w-[200px]">
                      <div
                        className=" absolute h-full rounded-full bg-yellow-500  top-0 left-0"
                        style={{ width: `${threeStar}%` }}
                      ></div>
                    </div>
                    <span>{threeStar}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>2</span>
                    <span>
                      <StarIconFilled className="w-4 h-4 text-yellow-500" />
                    </span>
                    <div className="relative h-[6px] rounded-full bg-gray-300 w-[200px]">
                      <div
                        className=" absolute h-full rounded-full bg-yellow-500 top-0 left-0"
                        style={{ width: `${twoStar}%` }}
                      ></div>
                    </div>
                    <span>{twoStar}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>1</span>
                    <span>
                      <StarIconFilled className="w-4 h-4 text-yellow-500" />
                    </span>
                    <div className="relative h-[6px] rounded-full bg-gray-300 w-[200px]">
                      <div
                        className=" absolute h-full rounded-full bg-yellow-500  top-0 left-0"
                        style={{ width: `${oneStar}%` }}
                      ></div>
                    </div>
                    <span>{oneStar}%</span>
                  </div>
                </div>
              </div>
            </div>
            <>
              <div className="">
                <span className="text-[20px] font-semibold">
                  All Reviews{" "}
                  <span className="text-gray-400 text-[14px] font-normal">
                    ({reviewsData.length})
                  </span>
                </span>
                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-4">
                    <button
                      className={`flex items-center justify-center font-normal text-[14px] py-2 px-7 transition-all duration-300 rounded-full mt-3  ${
                        filterRate === 0
                          ? " text-white bg-black"
                          : " text-gray-400 bg-[#f0f0f0] "
                      }`}
                      onClick={() => setFilterRate(0)}
                    >
                      All
                    </button>
                    <button
                      className={`flex items-center justify-center gap-2 font-normal text-[14px] py-2 px-7 transition-all duration-300 rounded-full mt-3  ${
                        filterRate === 5
                          ? " text-white bg-black"
                          : " text-gray-400 bg-[#f0f0f0] "
                      }`}
                      onClick={() => setFilterRate(5)}
                    >
                      <span>5</span>
                      <StarIconFilled className="size-4 text-yellow-500" />
                    </button>
                    <button
                      className={`flex items-center justify-center gap-2 font-normal text-[14px] py-2 px-7 transition-all duration-300 rounded-full mt-3  ${
                        filterRate === 4
                          ? " text-white bg-black"
                          : " text-gray-400 bg-[#f0f0f0] "
                      }`}
                      onClick={() => setFilterRate(4)}
                    >
                      <span>4</span>
                      <StarIconFilled className="size-4 text-yellow-500" />
                    </button>
                    <button
                      className={`flex items-center justify-center gap-2 font-normal text-[14px] py-2 px-7 transition-all duration-300 rounded-full mt-3  ${
                        filterRate === 3
                          ? " text-white bg-black"
                          : " text-gray-400 bg-[#f0f0f0] "
                      }`}
                      onClick={() => setFilterRate(3)}
                    >
                      <span>3</span>
                      <StarIconFilled className="size-4 text-yellow-500" />
                    </button>
                    <button
                      className={`flex items-center justify-center gap-2 font-normal text-[14px] py-2 px-7 transition-all duration-300 rounded-full mt-3  ${
                        filterRate === 2
                          ? " text-white bg-black"
                          : " text-gray-400 bg-[#f0f0f0] "
                      }`}
                      onClick={() => setFilterRate(2)}
                    >
                      <span>2</span>
                      <StarIconFilled className="size-4 text-yellow-500" />
                    </button>
                    <button
                      className={`flex items-center justify-center gap-2 font-normal text-[14px] py-2 px-7 transition-all duration-300 rounded-full mt-3  ${
                        filterRate === 1
                          ? " text-white bg-black"
                          : " text-gray-400 bg-[#f0f0f0] "
                      }`}
                      onClick={() => setFilterRate(1)}
                    >
                      <span>1</span>
                      <StarIconFilled className="size-4 text-yellow-500" />
                    </button>
                  </div>
                  <button
                    className="flex items-center justify-center font-normal py-3 px-7 text-white bg-black transition-all duration-500 hover:opacity-85 rounded-full text-[14px]"
                    onClick={() =>
                      user ? setIsReview(true) : setIsLogInToRate(true)
                    }
                  >
                    Write review
                  </button>
                </div>
                <div className="mt-7 grid grid-cols-2 gap-4">
                  {filteredReviewsData ? (
                    filteredReviewsData
                      .sort(
                        (a, b) =>
                          new Date(
                            b.createdAt
                              .split(" ")[0]
                              .split("-")
                              .reverse()
                              .join("-") +
                              " " +
                              b.createdAt.split(" ")[1]
                          ) -
                          new Date(
                            a.createdAt
                              .split(" ")[0]
                              .split("-")
                              .reverse()
                              .join("-") +
                              " " +
                              a.createdAt.split(" ")[1]
                          )
                      )
                      .map((reviews, index) => {
                        return (
                          <div
                            className={`flex flex-col gap-2 p-8 border rounded-2xl border-gray-200 py-5`}
                            key={index}
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {renderStars(reviews.rate, "size-6")}
                              </div>
                            </div>
                            <span className="text-[17px] font-medium leading-[24px] mt-4">
                              {reviews.userName}
                            </span>
                            <p className="text-gray-500 font-normal text-[14px]">
                              "{reviews.userReview}"
                            </p>
                            <div className="mt-4">
                              <span className="text-[15px] text-gray-500">
                                Post on {reviews.createdAt}
                              </span>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <Loading />
                  )}
                </div>
              </div>
            </>
          </div>
        </>
      </div>
      <Footer />
    </>
  );
};

export default PageReviews;
