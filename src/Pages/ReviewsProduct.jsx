import React, { useCallback } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import UserIconNone from "../Assets/UserIcon/360_F_795951406_h17eywwIo36DU2L8jXtsUcEXqPeScBUq-removebg-preview.webp";
import {
  query,
  collection,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { StarIcon as StarIconFilled } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Loading } from "../components/Loading";
import { UserContext } from "../Context/UserContext";
import { Error } from "./Error";
import { ToastContainer, toast } from "react-toastify";

const PageReviews = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingChange, setLoadingChange] = useState(true);
  const { productFind, loading } = location.state || {};
  // Context user
  const { user } = useContext(UserContext);
  // State filter rate
  const [filterRate, setFilterRate] = useState(0);
  const [filteredReviewsData, setFilteredReviewsData] = useState(null);
  // Reviewsa
  const [isReview, setIsReview] = useState(false);
  const [starReview, setStarReview] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [sendReview, setSendReview] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hàm xử lí gửi review của user
  const handleSendReview = useCallback(
    async (productId) => {
      try {
        if (user) {
          if (starReview !== 0) {
            const date = new Date();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const currentDay = `${day}-${month}-${year} ${hours}:${minutes}`;
            const ref = doc(db, "Reviews", uuid());
            const review = {
              productID: productId,
              userID: user.userId,
              userName: user.name,
              userEmail: user.email,
              userPhone: user.phone || "",
              userAddress: user.address || "",
              rate: starReview,
              userReview: userReview,
              createdAt: currentDay,
            };

            if (ref) {
              await setDoc(ref, review);
              if (setDoc) {
                setSendReview(true);
                setStarReview(0);
                setIsReview(false);
              }
            }
          } else {
            toast.warn("Please rate star's product!", {
              position: "top-center",
              autoClose: 1500,
            });
          }
        } else {
          navigate("/sign-up");
        }
      } catch (e) {
        return <Error />;
      }
    },
    [user, starReview]
  );

  // const handleSendReview = useCallback() async (productId) => {
  //     try {
  //         if (user) {
  //             if (starReview !== 0) {
  //                 const date = new Date();
  //                 const day = date.getDate();
  //                 const month = date.getMonth() + 1;
  //                 const year = date.getFullYear();
  //                 const hours = date.getHours();
  //                 const minutes = date.getMinutes();
  //                 const currentDay = `${day}-${month}-${year} ${hours}:${minutes}`;
  //                 const ref = doc(db, "Reviews", uuid());
  //                 const review = {
  //                     productID: productId,
  //                     userID: user.userId,
  //                     userName: user.name,
  //                     userEmail: user.email,
  //                     userPhone: user.phone || "",
  //                     userAddress: user.address || "",
  //                     rate: starReview,
  //                     userReview: userReview,
  //                     createdAt: currentDay,
  //                 };

  //                 if (ref) {
  //                     await setDoc(ref, review);
  //                     if (setDoc) {
  //                         setSendReview(true);
  //                         setStarReview(0);
  //                         setIsReview(false);
  //                     }
  //                 }
  //             } else {
  //                 toast.warn("Please rate star's product!", {
  //                     position: "top-center",
  //                     autoClose: 1500,
  //                 });
  //             }
  //         } else {
  //             navigate("/sign-up");
  //         }
  //     } catch (e) {
  //         return <Error />;
  //     }
  // };

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
  // Hàm lấy ra reviews của product
  useEffect(() => {
    const showReviews = async () => {
      try {
        if (productFind) {
          const reviewsQuery = query(
            collection(db, "Reviews"),
            where("productID", "==", `${productFind.id}`)
          );
          const reviewsSnap = await getDocs(reviewsQuery);
          const reviewsData = reviewsSnap.docs.map((doc) => doc.data());
          setReviewsData(reviewsData);
        }
      } catch (e) {
        return <Error />;
      } finally {
        setLoadingChange(false);
      }
    };
    showReviews();
  }, [productFind, sendReview]);
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
  }, [totalRate]);
  if (loading || loadingChange) {
    return <Loading />;
  }
  return (
    <div className="lg:px-[135px] px-[20px]">
      <Nav />
      {isReview && (
        <div className="overlay">
          <div className="popup w-[650px] h-[620px] bg-white rounded-xl p-7 flex flex-col justify-between relative">
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
                  onChange={(e) => setUserReview(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <button
                className="px-4 py-3 bg-blue-500 rounded-md flex items-center justify-center text-white font-medium text-[17px] outline-none w-full"
                onClick={() => {
                  handleSendReview(productFind.id);
                }}
              >
                Send review
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="">
        <div className="flex items-center gap-2 py-[80px]">
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
        <div className="pb-[60px]">
          <span className="text-[25px] font-semibold leading-[24px]">
            {reviewsData.length} Reviews {productFind.name}
          </span>
          <div className="flex items-start gap-[100px] py-[70px]">
            <div className="flex flex-col items-center justify-center gap-1">
              <img
                src={productFind.img[0]}
                alt=""
                className="size-[150px] object-contain "
              />
              <span className="text-[23px] font-medium leading-[24px]">
                {productFind.name}
              </span>
              <div className="flex items-center gap-4 py-5">
                <span className="text-[18px] font-medium">
                  ${productFind.newPrice}
                </span>
                <span className="line-through text-[15px] text-gray-500">
                  ${productFind.oldPrice}
                </span>
                <span className="text-[16px]">{productFind.sales}</span>
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
                    <div className=" absolute h-full rounded-full bg-yellow-500 w-[100px] top-0 left-0"></div>
                  </div>
                  <span>46.5%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>4</span>
                  <span>
                    <StarIconFilled className="w-4 h-4 text-yellow-500" />
                  </span>
                  <div className="relative h-[6px] rounded-full bg-gray-300 w-[200px]">
                    <div className=" absolute h-full rounded-full bg-yellow-500 w-[100px] top-0 left-0"></div>
                  </div>
                  <span>46.5%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>3</span>
                  <span>
                    <StarIconFilled className="w-4 h-4 text-yellow-500" />
                  </span>
                  <div className="relative h-[6px] rounded-full bg-gray-300 w-[200px]">
                    <div className=" absolute h-full rounded-full bg-yellow-500 w-[100px] top-0 left-0"></div>
                  </div>
                  <span>46.5%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>2</span>
                  <span>
                    <StarIconFilled className="w-4 h-4 text-yellow-500" />
                  </span>
                  <div className="relative h-[6px] rounded-full bg-gray-300 w-[200px]">
                    <div className=" absolute h-full rounded-full bg-yellow-500 w-[100px] top-0 left-0"></div>
                  </div>
                  <span>46.5%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>1</span>
                  <span>
                    <StarIconFilled className="w-4 h-4 text-yellow-500" />
                  </span>
                  <div className="relative h-[6px] rounded-full bg-gray-300 w-[200px]">
                    <div className=" absolute h-full rounded-full bg-yellow-500 w-[100px] top-0 left-0"></div>
                  </div>
                  <span>46.5%</span>
                </div>
                <div className="flex items-center justify-center pt-4">
                  <button
                    className="flex items-center justify-center px-10 py-3 text-white bg-blue-500 rounded-lg"
                    onClick={() => setIsReview(true)}
                  >
                    Write review
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="">
              <span>Filter reviews</span>
              <div className="flex items-center gap-4">
                <button
                  className={`flex items-center justify-center py-1 px-7 border-2 rounded-full mt-3  ${
                    filterRate === 0
                      ? "border-black text-black"
                      : "border-gray-400 text-gray-400 "
                  }`}
                  onClick={() => setFilterRate(0)}
                >
                  All
                </button>
                <button
                  className={`flex items-center gap-1 justify-center py-1 px-5 border-2  rounded-full mt-3 text-yellow-500 ${
                    filterRate === 5 ? "border-black" : "border-gray-400"
                  }`}
                  onClick={() => setFilterRate(5)}
                >
                  <span>5</span>
                  <StarIconFilled className="size-4 " />
                </button>
                <button
                  className={`flex items-center gap-1 justify-center py-1 px-5 border-2  rounded-full mt-3 text-yellow-500 ${
                    filterRate === 4 ? "border-black" : "border-gray-400"
                  }`}
                  onClick={() => setFilterRate(4)}
                >
                  <span>4</span>
                  <StarIconFilled className="size-4 " />
                </button>
                <button
                  className={`flex items-center gap-1 justify-center py-1 px-5 border-2  rounded-full mt-3 text-yellow-500 ${
                    filterRate === 3 ? "border-black" : "border-gray-400"
                  }`}
                  onClick={() => setFilterRate(3)}
                >
                  <span>3</span>
                  <StarIconFilled className="size-4 " />
                </button>
                <button
                  className={`flex items-center gap-1 justify-center py-1 px-5 border-2  rounded-full mt-3 text-yellow-500 ${
                    filterRate === 2 ? "border-black" : "border-gray-400"
                  }`}
                  onClick={() => setFilterRate(2)}
                >
                  <span>2</span>
                  <StarIconFilled className="size-4 " />
                </button>
                <button
                  className={`flex items-center gap-1 justify-center py-1 px-5 border-2  rounded-full mt-3 text-yellow-500 ${
                    filterRate === 1 ? "border-black" : "border-gray-400"
                  }`}
                  onClick={() => setFilterRate(1)}
                >
                  <span>1</span>
                  <StarIconFilled className="size-4 " />
                </button>
              </div>
              <div className="mt-7">
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
                          className={`flex flex-col gap-2 border-b-2 border-gray-200 py-5 `}
                          key={index}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <LazyLoadImage
                                src={UserIconNone}
                                className="size-[30px]"
                                effect="blur"
                              />
                              <span className="text-[17px] font-medium leading-[24px]">
                                {reviews.userName}
                              </span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] text-gray-500">
                                {reviews.createdAt}
                              </span>
                              <span className="text-[14px] text-gray-500">
                                {reviews.time}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {renderStars(reviews.rate, "size-4")}
                          </div>
                          <p>{reviews.userReview}</p>
                        </div>
                      );
                    })
                ) : (
                  <Loading />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default PageReviews;
