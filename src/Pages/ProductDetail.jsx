import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import { StarIcon as StarIconFilled } from "@heroicons/react/24/solid";
import "boxicons";
import { useParams } from "react-router-dom";
import UserIconNone from "../Assets/UserIcon/360_F_795951406_h17eywwIo36DU2L8jXtsUcEXqPeScBUq-removebg-preview.webp";
import Truck from "../Assets/ProductDetail/icon-delivery.svg";
import Return from "../Assets/ProductDetail/Icon-return.svg";
import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { Loading } from "../components/Loading";
import { Error } from "./Error";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useCart } from "react-use-cart";
import {
  collection,
  doc,
  query,
  setDoc,
  getDocs,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { fetchProductById } from "../FetchAPI/FetchAPI";
import { useQuery } from "@tanstack/react-query";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, CheckIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ProductDetailSkeleton from "../components/SkeletonProductDetail";
import countingRate from "../Service/countingRate";
const ProductDetail = () => {
  const [active, setActive] = useState("");
  // State đếm số lượng sản phẩm khi user increase hoặc decrease
  const [count, setCount] = useState(1);

  // Slide image của sản phẩm
  const [currentIndex, setCurrentIndex] = useState(0);
  // Loading
  const [loadBuy, setLoadBuy] = useState(false);
  // State để popup yêu cầu login
  const [isLogInToBuy, setIsLogInToBuy] = useState(false);
  const [isLogInToRate, setIsLogInToRate] = useState(false);
  const [isLogInToAddCart, setIsLogInToAddCart] = useState(false);
  // State cho Reviews
  const [isReview, setIsReview] = useState(false);
  const [starReview, setStarReview] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [sendReview, setSendReview] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  // State percent of star
  const [fiveStar, setFiveStar] = useState(0);
  const [fourStar, setFourStar] = useState(0);
  const [threeStar, setThreeStar] = useState(0);
  const [twoStar, setTwoStar] = useState(0);
  const [oneStar, setOneStar] = useState(0);
  // URL param
  const { productId } = useParams();
  // User Context
  const { user, currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  // Cart
  const { addItem } = useCart();
  // Popup
  const [addSuccess, setAddSuccess] = useState(false);
  // Dùng react query để fetch api
  const { data, isLoading, isError } = useQuery({
    queryKey: [`product ${productId}`],
    queryFn: () => fetchProductById(productId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Tính tổng tiền với số lượng user nhấn
  const totalPriceQuantity = useMemo(() => {
    if (data) {
      return Math.round(data.newPrice * count * 100) / 100;
    }
  }, [count, data]);

  // Set state màu đã chọn cho product
  // useEffect(() => {
  //   if (data) {
  //     setActive(data.colours1);
  //   }
  // }, [data]);
  // Hàm xử lí thêm vào carts
  const handleAddToCart = async (data) => {
    try {
      if (currentUser) {
        addItem(data);

        const cartRef = doc(db, `Carts`, currentUser.uid, "Product", data.id);
        const cartProduct = await getDoc(cartRef);
        if (cartProduct.exists()) {
          await updateDoc(cartRef, {
            quantity: cartProduct.data().quantity + count,
          });
        } else {
          await setDoc(cartRef, data);
        }

        setAddSuccess(true);
        setTimeout(() => {
          setAddSuccess(false);
        }, 1500);
      } else {
        setIsLogInToAddCart(true);
      }
    } catch (e) {
      toast.error("Error cann't add to cart!");
    }
  };
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

  // Hàm xử lí buy now của user
  const handleBuyNow = (product, count, colorActive, totalPriceQuantity) => {
    if (user) {
      setLoadBuy(true);
      // Cho product vào 1 mảng để bên checkout lấy ra được state array để lặp
      let productArr = [];
      // Update lại thuộc tính cho product
      product.quantity = count;
      product.color = colorActive;
      product.price = product.newPrice;
      product.itemTotal = product.newPrice * count;
      productArr.push(product);
      setLoadBuy(false);
      navigate(`/checkout/state=/${product.id}`, {
        state: { products: productArr, total: totalPriceQuantity },
      });
    } else {
      setIsLogInToBuy(true);
    }
  };
  // Hàm xử lí slide ảnh dp

  const prevSlide = () => {
    setCurrentIndex((curr) => (curr === 0 ? data.img.length - 1 : curr - 1));
  };
  const nextSlide = () => {
    setCurrentIndex((curr) => (curr === data.img.length - 1 ? 0 : curr + 1));
  };
  // Hàm kiểm tra user đăng nhập chưa mới review được
  const handleCheckUserIsLogInToReview = () => {
    if (currentUser) {
      setIsReview(true);
    } else {
      setIsLogInToRate(true);
    }
  };
  // Hàm xử lí gửi review của user
  const handleSendReview = async (productId) => {
    if (currentUser) {
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
      setIsReview(false);

      if (ref) {
        await setDoc(ref, review);
        setSendReview(true);
        setStarReview(0);
      } else {
        console.log("Error ref!");
      }
    } else {
      navigate("/sign-up");
    }
  };
  // Hàm lấy ra những reviews về sản phẩm
  const showReviews = useCallback(async () => {
    if (data) {
      const reviewsQuery = query(
        collection(db, "Reviews"),
        where("productID", "==", `${data.id}`)
      );
      const reviewsSnap = await getDocs(reviewsQuery);
      const reviewsData = reviewsSnap.docs.map((doc) => doc.data());
      setReviewsData(reviewsData);
    }
  }, [data]);
  useEffect(() => {
    showReviews();
  }, [data, showReviews, sendReview]);
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

  // Chỉ tính lại logic khi có thêm dữ liệu reviews thay đổi
  const percentRate = useMemo(() => {
    const count = countingRate(reviewsData);
    const totalReviews = reviewsData.length;
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

  if (isError) {
    return <Error />;
  }
  return (
    <div className="lg:px-[135px] px-[20px] bg-[#ffff]">
      <Nav />
      {addSuccess && (
        <div className="overlay-notifi">
          <div className="lg:w-[300px] lg:p-5 bg-black flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center bg-green-500 p-3 rounded-full">
              <CheckIcon className="text-white size-7" />
            </div>
            <span className="text-white lg:text-[18px] font-medium">
              Product Added To Cart!
            </span>
          </div>
        </div>
      )}
      {isLoading ? (
        <ProductDetailSkeleton />
      ) : (
        <>
          {isReview && (
            <div className="overlay">
              <div className=" w-[650px] h-[620px] bg-white rounded-xl p-7 flex flex-col justify-between relative">
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
                      src={data.img[0]}
                      effect="blur"
                      className="size-[100px] object-contain"
                    />
                    <span className="text-[18px] font-medium">{data.name}</span>
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
                      handleSendReview(data.id);
                    }}
                  >
                    Send review
                  </button>
                </div>
              </div>
            </div>
          )}
          {isLogInToRate && (
            <div className="overlay">
              <div className=" w-[550px] bg-white rounded-xl p-7 flex flex-col justify-between relative">
                <XMarkIcon
                  className="size-[30px] absolute right-[15px] top-[15px] hover:cursor-pointer"
                  onClick={() => setIsLogInToRate(false)}
                />
                <div className="">
                  <h3 className="text-[30px] font-medium text-center ">
                    You need to Log In
                  </h3>
                  <p className="py-7 text-[20px] font-normal text-center">
                    If you want to rate this product you need to log in your
                    account
                  </p>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <button
                    className="px-4 py-3 bg-blue-500 rounded-md flex items-center justify-center text-white font-medium text-[17px] outline-none w-full"
                    onClick={() => {
                      navigate("/log-in");
                    }}
                  >
                    Move to Log In
                  </button>
                </div>
              </div>
            </div>
          )}
          {isLogInToAddCart && (
            <div className="overlay">
              <div className=" w-[550px] bg-white rounded-xl p-7 flex flex-col justify-between relative">
                <XMarkIcon
                  className="size-[30px] absolute right-[15px] top-[15px] hover:cursor-pointer"
                  onClick={() => setIsLogInToAddCart(false)}
                />
                <div className="">
                  <h3 className="text-[30px] font-medium text-center ">
                    You need to Log In
                  </h3>
                  <p className="py-7 text-[20px] font-normal text-center">
                    If you wanna add this product in your cart you need to log
                    in your account
                  </p>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <button
                    className="px-4 py-3 bg-blue-500 rounded-md flex items-center justify-center text-white font-medium text-[17px] outline-none w-full"
                    onClick={() => {
                      navigate("/log-in");
                    }}
                  >
                    Move to Log In
                  </button>
                </div>
              </div>
            </div>
          )}
          {isLogInToBuy && (
            <div className="overlay">
              <div className=" w-[550px] bg-white rounded-xl p-7 flex flex-col justify-between relative">
                <XMarkIcon
                  className="size-[30px] absolute right-[15px] top-[15px] hover:cursor-pointer"
                  onClick={() => setIsLogInToBuy(false)}
                />
                <div className="">
                  <h3 className="text-[30px] font-medium text-center ">
                    You need to Log In
                  </h3>
                  <p className="py-7 text-[20px] font-normal text-center">
                    If you wanna order this product in your cart you need to log
                    in your account
                  </p>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <button
                    className="px-4 py-3 bg-blue-500 rounded-md flex items-center justify-center text-white font-medium text-[17px] outline-none w-full"
                    onClick={() => {
                      navigate("/log-in");
                    }}
                  >
                    Move to Log In
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
                Product Details
              </span>
              <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                /
              </span>
              <span className="text-black text-[14px] font-normal leading-[21px]">
                {data.name}
              </span>
            </div>
            <div className="pt-[80px] grid grid-cols-3 gap-[40px] ">
              <div className="col-span-2 flex flex-col justify-between">
                <div
                  className={`bg-[#f6f5f8] rounded-2xl h-[65%] flex items-center justify-center relative overflow-hidden `}
                >
                  <div className="flex items-center w-full h-full row-span-2 overflow-hidden">
                    {data.img.map((img, index) => {
                      return (
                        <div
                          className="flex items-center justify-center flex-shrink-0 w-full h-full transition-all duration-300 ease-in-out"
                          key={index}
                          style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                          }}
                        >
                          <img
                            src={img}
                            alt="ImageProduct"
                            className="object-contain size-[500px]"
                            effect="blur"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <button
                    className={`absolute left-[20px] top-[50%] size-[56px] rounded-full bg-gray-300 flex items-center justify-center translate-y-[-50%] hover:cursor-pointer ${
                      currentIndex === 0 ? "hidden" : ""
                    }`}
                    onClick={prevSlide}
                    disabled={currentIndex === 0 ? true : false}
                  >
                    <ChevronLeftIcon className="size-[40px]" />
                  </button>
                  <button
                    className={`absolute right-[20px] top-[50%] size-[56px] rounded-full bg-gray-300 flex items-center justify-center translate-y-[-50%] hover:cursor-pointer ${
                      currentIndex === data.img.length - 1 ? "hidden" : ""
                    }`}
                    onClick={nextSlide}
                  >
                    <ChevronRightIcon className="size-[40px]" />
                  </button>
                </div>
                <div className="border border-black mt-14 rounded-2xl">
                  <div className="flex items-center gap-4 px-4 py-[24px] ">
                    <LazyLoadImage
                      effect="blur"
                      src={Truck}
                      alt=""
                    />
                    <div className="flex flex-col gap-2">
                      <span className="text-[16px] font-medium leading-[24p]">
                        Free Delivery
                      </span>
                      <span className="text-[12px] font-medium leading-[18px] underline">
                        Enter your postal code for Delivery Availability
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-300 h-[1px]"></div>
                  <div className="flex items-center gap-4 px-4 py-[24px] ">
                    <LazyLoadImage
                      effect="blur"
                      src={Return}
                      alt=""
                    />
                    <div className="flex flex-col gap-2">
                      <span className="text-[16px] font-medium leading-[24p]">
                        Return Delivery
                      </span>
                      <span className="text-[12px] font-medium leading-[18px] underline">
                        Free 30 Days Delivery Returns. Details
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[28px] font-semibold leading-[35px] tracking-[0.72px]">
                  {data.name}
                </span>
                <div className={`flex items-center gap-2 pt-4`}>
                  <div className="flex items-center gap-1">
                    {renderStars(totalAvgRate, "size-5")}
                  </div>
                  <span className="text-[14px] font-semibold leading-[21px] opacity-50">
                    {`(${reviewsData.length})`}
                  </span>
                </div>
                <div className="flex items-center gap-2 pb-2 pt-7">
                  <span className="text-[23px] text-black font-medium  leading-[24px] tracking-[0.92px]">
                    {`$${data.newPrice}`}
                  </span>
                  <span
                    className={`text-[18px] text-[#343537] font-normal leading-[24px] tracking-[0.72px] opacity-50 line-through ${
                      data.oldPrice ? "block" : "hidden"
                    }`}
                  >
                    {`$${data.oldPrice}`}
                  </span>
                </div>
                <div className="h-[2px] my-[24px] bg-black opacity-20"></div>
                <div className="pb-4">
                  <span className="text-[20px] font-medium leading-[24px]">{`Infomations about ${data.name}`}</span>
                </div>
                {data.cate === "laptop" ? (
                  <div className="p-4 border border-black rounded-2xl">
                    <div className="flex flex-col gap-2 py-2">
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          CPU:
                        </span>
                        <span className="text-[16px] font-normal">
                          {data.infomation.cpu}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          RAM:
                        </span>
                        <span className="text-[16px] font-normal">
                          {`${data.infomation.ram} GB`}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Hard Drive:
                        </span>
                        <span>{`${data.infomation.hardDrive} GB SSD`}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Display:
                        </span>
                        <span className="text-[16px] font-normal">{`${data.infomation.inch} inch, ${data.infomation.resolution}, ${data.infomation.hz}Hz`}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Card:
                        </span>
                        <span className="text-[16px] font-normal">{`${data.infomation.card}`}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Connector:
                        </span>
                        <span className="text-[16px] font-normal">{`${data.infomation.connector}`}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Battery:
                        </span>
                        <span className="text-[16px] font-normal">{`${data.infomation.pin}`}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Weight:
                        </span>
                        <span className="text-[16px] font-normal">{`${data.infomation.weight}kg`}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {data.cate === "phone" ? (
                  <div className="p-4 border border-black rounded-2xl">
                    <div className="flex flex-col gap-2 py-2">
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Front Camera:
                        </span>
                        <span className="text-[16px] font-normal">
                          {data.infomation.frontCamera}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Behind Camera:
                        </span>
                        <span className="text-[16px] font-normal">
                          {data.infomation.behindCamera}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          CPU:
                        </span>
                        <span className="text-[16px] font-normal">
                          {data.infomation.cpu}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          RAM:
                        </span>
                        <span className="text-[16px] font-normal">
                          {`${data.infomation.ram} GB`}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Hz:
                        </span>
                        <span className="text-[16px] font-normal">
                          {data.infomation.hz} Hz
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Hard Drive:
                        </span>
                        <span>{`${data.infomation.hardDrive} GB`}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Display:
                        </span>
                        <span className="text-[16px] font-normal">{`${data.infomation.inch} inch, ${data.infomation.resolution}, ${data.infomation.hz}Hz`}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Connector:
                        </span>
                        <span className="text-[16px] font-normal">{`${data.infomation.connector}`}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Battery:
                        </span>
                        <span className="text-[16px] font-normal">{`${data.infomation.pin}`}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[18px] font-medium leading-[24px]">
                          Weight:
                        </span>
                        <span className="text-[16px] font-normal">{`${data.infomation.weight}kg`}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="h-[1px] my-[24px] bg-black opacity-20"></div>
                {data.cate === "laptop" ? (
                  <div
                    className={`flex-col  gap-4 pb-5 ${
                      data.infomation.colors ? "flex" : "hidden"
                    }`}
                  >
                    <span className="text-[17px] font-normal leading-[24px] text-[#545557]">
                      Available Colors
                    </span>
                    <div className="flex items-center gap-2">
                      {data.infomation.colors
                        ? data.infomation.colors.map((color) => {
                            return (
                              <button
                                className={`border ${
                                  color ? "block" : "hidden"
                                } border-black rounded-full size-5 color-${color} ${
                                  active === color ? "scale-125" : ""
                                }`}
                                onClick={() => setActive(data.colours1)}
                              ></button>
                            );
                          })
                        : ""}
                      <button
                        className={`border ${
                          data.colours1 ? "block" : "hidden"
                        } border-black rounded-full size-5 color-${
                          data.colours1
                        } ${active === data.colours1 ? "scale-125" : ""}`}
                        onClick={() => setActive(data.colours1)}
                      ></button>
                      <button
                        className={`border ${
                          data.colours2 ? "block" : "hidden"
                        }   border-black rounded-full size-5 color-${
                          data.colours2
                        } ${active === data.colours2 ? "scale-125" : ""} `}
                        onClick={() => setActive(data.colours2)}
                      ></button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {data.cate === "phone" ? (
                  <div
                    className={`flex-col  gap-4 pb-5 ${
                      data.colours1 ? "flex" : "hidden"
                    }`}
                  >
                    <span className="text-[17px] font-normal leading-[24px] text-[#545557]">
                      Available Colors
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        className={`border ${
                          data.colours1 ? "block" : "hidden"
                        } border-black rounded-full size-5 color-${
                          data.colours1
                        } ${active === data.colours1 ? "scale-125" : ""}`}
                        onClick={() => setActive(data.colours1)}
                      ></button>
                      <button
                        className={`border ${
                          data.colours2 ? "block" : "hidden"
                        }   border-black rounded-full size-5 color-${
                          data.colours2
                        } ${active === data.colours2 ? "scale-125" : ""} `}
                        onClick={() => setActive(data.colours2)}
                      ></button>
                      <button
                        className={`border ${
                          data.colours3 ? "block" : "hidden"
                        }   border-black rounded-full size-5 color-${
                          data.colours3
                        } ${active === data.colours3 ? "scale-125" : ""} `}
                        onClick={() => setActive(data.colours3)}
                      ></button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div
                  className={`flex-col  gap-4 py-[24px] ${
                    data.size ? "flex" : "hidden"
                  }`}
                >
                  <span className="text-[17px] font-normal leading-[24px] text-[#545557]">
                    Available Size:
                  </span>
                  <div className="flex items-center gap-4 text-[14px font-medium leading-[21px]">
                    <div className="size-[32px] border border-black rounded flex items-center justify-center">
                      XS
                    </div>
                    <div className="size-[32px] border border-black rounded flex items-center justify-center">
                      S
                    </div>
                    <div className="size-[32px] border border-black rounded flex items-center justify-center">
                      M
                    </div>
                    <div className="size-[32px] border border-black rounded flex items-center justify-center">
                      L
                    </div>
                    <div className="size-[32px] border border-black rounded flex items-center justify-center">
                      XL
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center border w-fit border-black rounded-full h-[44px]  px-2">
                    <div
                      className="flex items-center justify-center hover:cursor-pointer"
                      onClick={() => {
                        setCount(count - 1);
                        if (count === 0) {
                          setCount(0);
                        }
                      }}
                    >
                      <box-icon name="minus"></box-icon>
                    </div>
                    <div className="flex items-center justify-center w-[60px] text-[20px] font-medium leading-[28px]">
                      {count}
                    </div>
                    <div
                      className="flex items-center justify-center hover:cursor-pointer"
                      onClick={() => setCount(count + 1)}
                    >
                      <box-icon name="plus"></box-icon>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 py-4">
                    <button
                      className="flex items-center justify-center border-2 border-black rounded-full group  w-full py-[10px] text-[16px] font-medium leading-[24px] hover:bg-black transition-all duration-500"
                      onClick={() => {
                        if (data.cate === "laptop") {
                          handleAddToCart({
                            id: data.id,
                            name: data.name,
                            img: data.img,
                            price: data.newPrice,
                            brand: data.brand,
                            color: "",
                            infomation: {
                              ...data.infomation,
                            },
                            sales: data.sales,
                            quantity: count,
                            cate: data.cate,
                            isSale: data.isSale || false,
                          });
                        }
                        if (data.cate === "phone") {
                          handleAddToCart({
                            id: data.id,
                            name: data.name,
                            img: data.img,
                            price: data.newPrice,
                            brand: data.brand,
                            color: "",

                            infomation: {
                              ...data.infomation,
                            },

                            sales: data.sales,

                            quantity: count,
                            cate: data.cate,
                            isSale: data.isSale || false,
                          });
                        }
                      }}
                    >
                      <span className="text-black group-hover:text-white">
                        Add to cart
                      </span>
                    </button>
                    <button
                      className="bg-[#0077ed] rounded-full w-full flex items-center justify-center text-white  py-[12px] text-[16px] font-medium leading-[24px] hover:opacity-85 transition-all duration-500"
                      onClick={() =>
                        handleBuyNow(data, count, active, totalPriceQuantity)
                      }
                    >
                      {loadBuy ? (
                        <div className="w-[68px] flex items-center justify-center h-[24px]">
                          <div className="loader-buy"></div>
                        </div>
                      ) : (
                        <span>Buy now</span>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <span className="text-[28px] font-medium leading-[21px]">
                    Total:
                  </span>
                  <span className="text-[24px] font-normal leading-[24px] tracking-[0.72px]">
                    {`$${Math.round(totalPriceQuantity * 100) / 100}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 py-[100px]">
              <div className="border border-black rounded-lg  col-span-2 p-[25px]">
                <span className="text-[25px] font-medium">
                  Reviews {data.name}
                </span>
                <div className="flex flex-col gap-8 py-8">
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
                          className={`absolute h-full rounded-full bg-yellow-500  top-0 left-0 `}
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
                <>
                  {reviewsData

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
                          className={`flex flex-col gap-2 border-b-2 border-gray-200 py-5 ${
                            index > 1 ? "hidden" : "flex"
                          }`}
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
                            </div>
                          </div>
                          <div className="flex items-center">
                            {renderStars(reviews.rate, "size-4")}
                          </div>
                          <p>{reviews.userReview}</p>
                        </div>
                      );
                    })}
                </>

                <div className="grid grid-cols-2 gap-4 py-7">
                  <button
                    className={`flex items-center justify-center py-3 border-2 font-medium border-black rounded-full transition-all duration-500 hover:bg-black hover:text-white ${
                      reviewsData.length === 0 ? "hidden" : "flex"
                    }`}
                    onClick={() =>
                      navigate(`/${data.cate}/${data.name}/reviews`, {
                        state: {
                          productFind: data,
                        },
                      })
                    }
                  >
                    View more reviews
                  </button>
                  <button
                    className="flex items-center justify-center font-medium py-3 text-white bg-blue-500 transition-all duration-500 hover:opacity-85 rounded-full"
                    onClick={() => handleCheckUserIsLogInToReview()}
                  >
                    Write your review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
      <ToastContainer />
    </div>
  );
};
export default ProductDetail;
