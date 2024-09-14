import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import useMobile from "../Hooks/useMobile";
import SkeletonCard from "../components/SkeletonLoadingCard";
import { Error } from "./Error";
import { ToastContainer } from "react-toastify";
import { Pagination } from "../components/Pagination";
import { ListPhones } from "../components/ListPhones";
import { useQuery } from "@tanstack/react-query";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { fetchProductsPhone } from "../FetchAPI/FetchAPI";
const Phones = () => {
  // State lưu các phones khi filter
  const [filteredProducts, setFilteredProducts] = useState([]);
  // State lưu các brand khi selected vào 1 mảng
  const [selectedBrands, setSelectedBrands] = useState([]);
  // State lưu các ram khi selected vào 1 mảng
  const [selectedRam, setSelectedRam] = useState([]);
  // State lưa các storage khi selected vào 1 mảng
  const [selectedStorage, setSelectedStorage] = useState([]);
  // State Hz
  const [selectedHz, setSelectedHz] = useState([]);

  // State để set mức min max giá tiền
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceRange, setPriceRange] = useState(0);
  // Popup cho filter ở mobile
  const [isFilter, setIsFilter] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);
  const [countFilter, setCountFilter] = useState(0);
  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);
  // Mảng chứa các brand cho phones
  const brandsName = ["iphone", "samsung", "xiaomi", "vivo", "oppo"];
  // Mảng chứa ram
  const Ram = [3, 4, 6, 8, 12, 16];
  // Mảng chứa dung lượng lữu trữ
  const Storage = [64, 128, 256, 512, 1];
  const Hz = [60, 90, 120];

  // Hàm lấy ra những sản phẩm là phone
  const { data, isLoading, isError } = useQuery({
    queryKey: [`productsPhone`],
    queryFn: fetchProductsPhone,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const isMobile = useMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Lấy page từ session nếu có tránh reload bị về lại page 1
  useEffect(() => {
    const sessionCurrentPage = sessionStorage.getItem("currentPage");
    if (sessionCurrentPage) {
      setCurrentPage(sessionCurrentPage);
    }
  }, [currentPage]);
  // Khi component unmount thì xóa currentPage khỏi session
  useEffect(() => {
    return () => sessionStorage.removeItem("currentPage");
  }, []);
  // Filter desktop
  useEffect(() => {
    if (!isMobile) {
      if (data) {
        let filtered = data;
        // Lọc sản phẩm theo brand
        if (selectedBrands.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedBrands.includes(product.brand)
          );
        }
        // Lọc sản phẩm theo giá tiền

        if (minPrice || maxPrice) {
          // Xử lí khi chọn option thì cho page hiện tại là 1
          setCurrentPage(1);

          filtered = filtered.filter(
            (product) =>
              Number(product.newPrice) >= minPrice &&
              Number(product.newPrice) <= maxPrice
          );
          window.scrollTo(0, 0);
        }
        // Lọc sản phẩm theo ram
        if (selectedRam.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedRam.includes(Number(product.infomation.ram))
          );
        }
        // Lọc sản phẩm theo storage
        if (selectedStorage.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedStorage.includes(Number(product.infomation.hardDrive))
          );
        }

        // Lọc sản phẩm theo Hz
        if (selectedHz.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedHz.includes(Number(product.infomation.hz))
          );
        }

        // Set state sau khi lọc
        setFilteredProducts(filtered);
      }
    }
  }, [
    selectedBrands,
    data,
    minPrice,
    maxPrice,
    selectedRam,
    selectedStorage,
    isMobile,
    selectedHz,
  ]);
  // Xử lí khi chọn nhiều brand
  const handleBrandChange = (e) => {
    window.scrollTo(0, 0);
    const brand = e.target.value;
    // Xử lí khi chọn option thì cho page hiện tại là 1
    setCurrentPage(1);
    setSelectedBrands((prevSelectedBrands) =>
      prevSelectedBrands.includes(brand)
        ? prevSelectedBrands.filter((b) => b !== brand)
        : [...prevSelectedBrands, brand]
    );
  };
  // Hàm xử lí khi chọn 1 hoặc nhiều ram
  const handleRamChange = (e) => {
    window.scrollTo(0, 0);
    const ram = Number(e.target.value);
    // Xử lí khi chọn option thì cho page hiện tại là 1
    setCurrentPage(1);
    setSelectedRam((prevSelectedRam) =>
      prevSelectedRam.includes(ram)
        ? prevSelectedRam.filter((a) => a !== ram)
        : [...prevSelectedRam, ram]
    );
  };
  // Hàm xử lí khi chọn 1 hoặc nhiều Storage GB
  const handleStorageChange = (e) => {
    window.scrollTo(0, 0);
    const storage = Number(e.target.value);
    setCurrentPage(1);
    setSelectedStorage((prevSelectedStorage) =>
      prevSelectedStorage.includes(storage)
        ? prevSelectedStorage.filter((a) => a !== storage)
        : [...prevSelectedStorage, storage]
    );
  };

  // Hàm xử lí khi chọn 1 hoặc nhiều loại hz
  const handleHzChange = (e) => {
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
    const Hz = Number(e.target.value);
    // Xử lí khi chọn option thì cho page hiện tại là 1
    setCurrentPage(1);
    setSelectedHz((prevSelectedHz) =>
      prevSelectedHz.includes(Hz)
        ? prevSelectedHz.filter((h) => h !== Hz)
        : [...prevSelectedHz, Hz]
    );
  };
  // Hàm xử lí khi người dùng nhập price là số âm
  const preventNegativeInput = (e) => {
    if (e.target.value < 0) {
      e.target.value = 0;
    }
  };
  // Phân trang
  // Tìm ra vị trí cuối của product 1 * 6 = 6
  const lastPostIndex = currentPage * postsPerPage;
  // Tìm ra vị trí đầu của product 6 - 6 = 0
  const firstPostIndex = lastPostIndex - postsPerPage;
  // Lấy ra những products từ vị trí đầu tới cuối 1 - 6
  const currentPosts = filteredProducts.slice(firstPostIndex, lastPostIndex);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"; // Kích hoạt cuộn mượt mà khi cần
    return () => {
      document.documentElement.style.scrollBehavior = "auto"; // Tắt cuộn mượt mà khi chuyển trang
    };
  }, []);
  useEffect(() => {
    if (isFilter) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "auto";
    }
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [isFilter]);
  useEffect(() => {
    if (isMobile) {
      if (data) {
        setFilteredProducts(data);
      }
    }
  }, [data, isMobile]);
  const applyFilter = () => {
    if (isMobile) {
      if (data) {
        setIsFilter(false);
        let filtered = data;
        // Lọc sản phẩm theo brand
        if (selectedBrands.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedBrands.includes(product.brand)
          );
        }
        if (priceRange > 0) {
          // Xử lí khi chọn option thì cho page hiện tại là 1
          setCurrentPage(1);
          filtered = filtered.filter(
            (product) => Number(product.newPrice) <= priceRange
          );
        }
        // Lọc sản phẩm theo ram
        if (selectedRam.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedRam.includes(Number(product.infomation.ram))
          );
        }
        // Lọc sản phẩm theo storage
        if (selectedStorage.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedStorage.includes(Number(product.infomation.hardDrive))
          );
        }
        // Lọc sản phẩm theo Hz
        if (selectedHz.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedHz.includes(Number(product.infomation.hz))
          );
        }
        // Set state sau khi lọc
        setFilteredProducts(filtered);
      }
    }
  };
  // Check ẩn hiện nút clear filter
  useEffect(() => {
    if (
      priceRange > 0 ||
      selectedBrands.length > 0 ||
      selectedRam.length > 0 ||
      selectedStorage.length > 0 ||
      selectedHz.length > 0
    ) {
      setClearFilter(false);
    } else {
      setClearFilter(true);
    }
  }, [priceRange, selectedBrands, selectedRam, selectedStorage, selectedHz]);
  // Hàm clear filter
  const clearFiler = () => {
    setClearFilter(true);
    setPriceRange(0);
    setSelectedBrands([]);
    setSelectedHz([]);
    setSelectedRam([]);
    setSelectedStorage([]);
  };
  // Hàm đếm số filter
  const countSelectedFilters = () => {
    return (
      (priceRange > 0 ? 1 : 0) +
      (selectedBrands.length > 0 ? selectedBrands.length : 0) +
      (selectedRam.length > 0 ? selectedRam.length : 0) +
      (selectedStorage.length > 0 ? selectedStorage.length : 0) +
      (selectedHz.length > 0 ? selectedHz.length : 0)
    );
  };

  if (isError) {
    return <Error />;
  }
  return (
    <div className="lg:px-[135px]">
      <Nav />
      <div className="px-[20px]">
        <div className=" lg:py-[80px] py-[40px]">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
              Categories
            </span>
            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
              /
            </span>
            <span className="text-black text-[14px] font-normal  leading-[21px]">
              Phones
            </span>
          </div>
        </div>
        <div className="pb-[140px] flex gap-4 lg:flex-row flex-col">
          {/* Filter Desktop */}
          <div className="px-3  flex-col lg:flex hidden">
            <div className="border-t-2 border-[gray-500] py-3">
              <div>
                <span className="text-[17px] font-semibold leading-[21px]">
                  Brand
                </span>
                <form
                  action=""
                  className="lg:grid lg:grid-cols-2 py-3 gap-3"
                >
                  {brandsName.map((brandName) => (
                    <div
                      className="flex items-center gap-3"
                      key={brandName}
                    >
                      <input
                        type="checkbox"
                        id={brandName}
                        name={brandName}
                        value={brandName}
                        className="size-4 hover:cursor-pointer"
                        onChange={handleBrandChange}
                        checked={selectedBrands.includes(brandName)}
                      />
                      <label
                        htmlFor={brandName}
                        className="text-[15px] font-medium leading-[24px]"
                      >
                        {brandName.charAt(0).toUpperCase() + brandName.slice(1)}
                      </label>
                    </div>
                  ))}
                </form>
              </div>
            </div>
            <div className="border-t-2 border-[gray-500] py-3">
              <div className="">
                <span className="text-[17px] font-semibold  leading-[21px]">
                  Price, $ USD
                </span>
                <form
                  action=""
                  className="flex flex-col py-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 ">
                      <label
                        htmlFor="minPrice"
                        className="text-[15px] font-medium  leading-[24px]"
                      >
                        Min
                      </label>
                      <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        value={minPrice}
                        className=" border-2 border-gray-400 rounded pl-1 w-[70px] outline-none"
                        onChange={(e) => {
                          setMinPrice(e.target.value);
                        }}
                        onInput={preventNegativeInput}
                      />
                    </div>
                    <div className="flex items-center gap-2 ">
                      <label
                        htmlFor="minPrice"
                        className="text-[15px] font-medium  leading-[24px]"
                      >
                        Max
                      </label>
                      <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        value={maxPrice}
                        className=" border-2 outline-none border-gray-400 rounded pl-1 w-[70px]"
                        onChange={(e) => {
                          setMaxPrice(e.target.value);
                        }}
                        onInput={preventNegativeInput}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="border-t-2 border-[gray-500] py-3">
              <div className="">
                <span className="text-[17px] font-semibold leading-[21px]">
                  RAM
                </span>
                <form
                  action=""
                  className="flex flex-col py-3"
                >
                  <div className="lg:grid lg:grid-cols-2 gap-3 ">
                    {Ram.map((ram, index) => {
                      return (
                        <div
                          className="flex items-center gap-3"
                          key={index}
                        >
                          <input
                            type="checkbox"
                            name={ram}
                            id={ram}
                            value={ram}
                            className="size-4  outline-none hover:cursor-pointer"
                            onChange={handleRamChange}
                          />
                          <label
                            htmlFor={ram}
                            className="text-[15px] font-medium leading-[24px]"
                          >{`${ram} GB`}</label>
                        </div>
                      );
                    })}
                  </div>
                </form>
              </div>
            </div>
            {/* Storage */}
            <div className="border-t-2 border-[gray-500] py-3">
              <div>
                <span className="text-[17px] font-semibold leading-[21px]">
                  Storage
                </span>
                <form
                  action=""
                  className="lg:grid lg:grid-cols-2  py-3 gap-3"
                >
                  {Storage.map((storage, index) => (
                    <div
                      className="flex items-center gap-3"
                      key={index}
                    >
                      <input
                        type="checkbox"
                        id={storage}
                        name={storage}
                        value={storage}
                        className="size-4 hover:cursor-pointer"
                        onChange={handleStorageChange}
                        checked={selectedStorage.includes(storage)}
                      />
                      <label
                        htmlFor={storage}
                        className="text-[15px] font-medium leading-[24px]"
                      >
                        {storage === 1 ? `${storage} TB` : `${storage} GB`}
                      </label>
                    </div>
                  ))}
                </form>
              </div>
            </div>
            {/* Hz */}
            <div className="border-t-2 border-[gray-500] py-3">
              <div>
                <span className="text-[17px] font-semibold leading-[21px]">
                  Hz
                </span>
                <form
                  action=""
                  className="lg:grid lg:grid-cols-2  py-3 gap-3"
                >
                  {Hz.map((hz) => (
                    <div
                      className="flex items-center gap-3"
                      key={hz}
                    >
                      <input
                        type="checkbox"
                        id={hz}
                        name={hz}
                        value={hz}
                        className="size-4 hover:cursor-pointer"
                        onChange={handleHzChange}
                        checked={selectedHz.includes(hz)}
                      />
                      <label
                        htmlFor={hz}
                        className="text-[15px] font-medium leading-[24px]"
                      >
                        {hz}Hz
                      </label>
                    </div>
                  ))}
                </form>
              </div>
            </div>
          </div>
          {/* Filter Mobile */}
          <button
            className="py-2 px-3 border-2 border-gray-300 rounded-md w-fit lg:hidden flex items-center relative gap-2"
            onClick={() => setIsFilter(true)}
          >
            <div
              className={`flex items-center justify-center rounded-full absolute right-2 top-[-50%] translate-y-[50%] bg-[#f89406] text-white size-5 pt-[1.5px] ${
                countSelectedFilters() === 0 ? "hidden" : "flex"
              }`}
            >
              <span className="text-[13px] font-semibold">
                {countSelectedFilters()}
              </span>
            </div>
            <FunnelIcon className="size-5" />
            <span className="font-medium">Filter</span>
          </button>
          <div
            className={`${
              isFilter ? "overlay-filter" : "overlay-filter hidden"
            }`}
          >
            <div
              className={`bg-white rounded-t-xl overflow-hidden w-full h-[500px] pb-8 ${
                isFilter ? "popup open" : "popup"
              }`}
            >
              <button
                className={`flex items-center justify-end w-full px-2 py-1  shadow-md `}
                onClick={() => {
                  setIsFilter(false);
                  applyFilter();
                }}
              >
                <XMarkIcon className="size-[30px] " />
              </button>
              <div className="overflow-y-auto h-full p-4 pb-0">
                {/* Brands */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">Brands</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {brandsName.map((brandName) => (
                      <label
                        key={brandName}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedBrands.includes(brandName)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={brandName}
                          name={brandName}
                          value={brandName}
                          className={`absolute opacity-0`}
                          onChange={handleBrandChange}
                          checked={selectedBrands.includes(brandName)}
                        />
                        <span className="text-[12px] font-medium">
                          {brandName.charAt(0).toUpperCase() +
                            brandName.slice(1)}
                        </span>
                      </label>
                    ))}
                  </form>
                </div>
                {/* Price */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">Price, USD</span>
                  <div className="flex items-center gap-3">
                    <span>$0</span>
                    <span>-</span>
                    <span>${priceRange}</span>
                  </div>
                  <input
                    type="range"
                    name="price"
                    id="price"
                    value={priceRange}
                    min={0}
                    max={10000}
                    step={200}
                    onChange={(e) => setPriceRange(e.target.value)}
                  />
                </div>
                {/* RAM */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">RAM</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {Ram.map((ram) => (
                      <label
                        key={ram}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedRam.includes(ram)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={ram}
                          name={ram}
                          value={ram}
                          className={`absolute opacity-0`}
                          onChange={handleRamChange}
                          checked={selectedRam.includes(ram)}
                        />
                        <span className="text-[12px] font-medium">{ram}GB</span>
                      </label>
                    ))}
                  </form>
                </div>
                {/* Hard Drive */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">Hard Drive</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {Storage.map((storage) => (
                      <label
                        key={storage}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedStorage.includes(storage)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={storage}
                          name={storage}
                          value={storage}
                          className={`absolute opacity-0`}
                          onChange={handleStorageChange}
                          checked={selectedStorage.includes(storage)}
                        />
                        <span className="text-[12px] font-medium">
                          {storage === 1 || storage === 2
                            ? `${storage} TB`
                            : `${storage} GB`}
                        </span>
                      </label>
                    ))}
                  </form>
                </div>
                {/* Hz */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">Hz</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {Hz.map((hz) => (
                      <label
                        key={hz}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedHz.includes(hz)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={hz}
                          name={hz}
                          value={hz}
                          className={`absolute opacity-0`}
                          onChange={handleHzChange}
                          checked={selectedHz.includes(hz)}
                        />
                        <span className="text-[12px] font-medium">{hz}Hz</span>
                      </label>
                    ))}
                  </form>
                </div>

                {/* Button  */}
                <div className="sticky bottom-0 left-0 flex items-center justify-between  w-full bg-white border-t border-gray-200 py-4 pb-6">
                  <button
                    type="button"
                    className={`px-4 py-1 border-2 text-[#0077ed] border-gray-100 rounded-lg font-medium text-[15px]  ${
                      clearFilter ? "hidden" : "block"
                    }`}
                    onClick={() => clearFiler()}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="px-4 py-1 bg-[#0077ed] border-2 ml-auto border-[#0077ed] text-white font-medium rounded-lg text-[15px]"
                    onClick={() => applyFilter()}
                  >
                    Show
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full py-4">
            {isLoading ? (
              <div className="grid lg:grid-cols-3 grid-cols-1 gap-x-[30px] gap-y-[60px]">
                {Array.from({ length: currentPosts.length || 15 }).map(
                  (_, index) => (
                    <SkeletonCard key={index} />
                  )
                )}
              </div>
            ) : (
              <>
                <ListPhones filteredProducts={currentPosts} />
                <div className="flex items-center justify-center">
                  <Pagination
                    totalPosts={filteredProducts.length}
                    postsPerPage={postsPerPage}
                    // Callback để lấy ra currentPage để tính toán lại index và lấy ra products để render
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};
export default Phones;
