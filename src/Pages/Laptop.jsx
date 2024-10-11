import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { Error } from "./Error";
import ListLaptops from "../components/ListLaptops";
import { Pagination } from "../components/Pagination";
import { ToastContainer } from "react-toastify";
import { fetchProductsLaptop } from "../FetchAPI/FetchAPI";
import { useQuery } from "@tanstack/react-query";
import { XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import SkeletonCard from "../components/SkeletonLoadingCard";
import useMobile from "../Hooks/useMobile";
const Laptops = () => {
  // State lưu các phones khi filter
  const [filteredProducts, setFilteredProducts] = useState([]);
  // State lưu các brand khi selected vào 1 mảng
  const [selectedBrands, setSelectedBrands] = useState([]);
  // State lưu các ram khi selected vào 1 mảng
  const [selectedRam, setSelectedRam] = useState([]);
  // State lưu các hard drive khi selected vào 1 mảng
  const [selectedStorage, setSelectedStorage] = useState([]);
  // State để set mức min max giá tiền
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  // State để lưu các type khi seleted vào 1 mảng
  const [selectedType, setSelectedType] = useState([]);
  //  State để lưu các inch khi selected vào 1 mảng
  const [selectedInch, setSelectedInch] = useState([]);
  // State để lưu các resolution khi selected vào 1 mảng
  const [selectedResolution, setSelectedResolution] = useState([]);
  // State để lưu các hz khi selected vào 1 mảng
  const [selectedHz, setSelectedHz] = useState([]);
  // State để lưu các chip core intel khi selected vào 1 mảng
  const [selectedCore, setSelectedCore] = useState([]);
  // State để lưu các chip ultra khi selected vào 1 mảng
  const [selectedUltra, setSelectedUltra] = useState([]);
  // State để lưu các chip AMD khi selected vào 1 mảng
  const [selectedAmd, setSelectedAmd] = useState([]);
  // State để lưu các chip M khi selected vào 1 mảng
  const [selectedApple, setSelectedApple] = useState([]);
  const [priceRange, setPriceRange] = useState(0);
  // State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(15);
  // Popup cho checkbox dành cho mobile
  const [isFilter, setIsFilter] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);
  const [countFilter, setCountFilter] = useState(0);
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
  // Mảng chứa các brand cho phones
  const brandsName = ["Dell", "Asus", "Acer", "Lenovo", "Macbook", "Hp", "Msi"];
  // Mảng chứa ram
  const Ram = [8, 16, 32, 36, 64];
  // Mảng chứa dung lượng lữu trữ
  const Storage = [256, 512, 1, 2];
  // Mảng chứa màn hình inch
  const Inch = [
    11.6, 13.3, 13.4, 13.6, 14, 14.2, 15.6, 16, 16.1, 16.2, 17, 17.3, 18,
  ];
  // Mảng chứa Core I
  const Core = ["Core i3", "Core i5", "Core i7", "Core i9"];
  // Mảng chứa Ryzen
  const Ryzen = ["Ryzen 5", "Ryzen 7", "Ryzen 9"];
  // Mảng chứa Apple M
  const Apple = [
    "Apple M1",
    "Apple M2",
    "Apple M3",
    "Apple M3 Pro",
    "Apple M3 Pro Max",
  ];
  // Mảng chứa Ultra
  const Ultra = ["Ultra 5", "Ultra 7", "Ultra 9"];
  // Mảng chứa độ phân giải
  const Resolution = ["Full HD", "2K", "2.8K", "4K", "Retina", "Liquid Retina"];

  // Mảng chứa tần số quét Hz
  const Hz = [60, 90, 120, 144, 165, 240];
  // Mảng chứa loại lap
  const Type = ["Office Learn", "Thin Light", "Gaming"];

  const { data, isLoading, isError } = useQuery({
    queryKey: [`products`],
    queryFn: fetchProductsLaptop,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  // Check UI Mobile
  const isMobile = useMobile();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Filter ở desktop
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
        if (minPrice && maxPrice) {
          // Xử lí khi chọn option thì cho page hiện tại là 1
          setCurrentPage(1);
          filtered = filtered.filter(
            (product) =>
              Number(product.newPrice) >= minPrice &&
              Number(product.newPrice) <= maxPrice
          );
          window.scrollTo(0, 0);
        }
        if (minPrice) {
          // Xử lí khi chọn option thì cho page hiện tại là 1
          setCurrentPage(1);
          filtered = filtered.filter(
            (product) => Number(product.newPrice) >= minPrice
          );
          window.scrollTo(0, 0);
        }
        if (maxPrice) {
          // Xử lí khi chọn option thì cho page hiện tại là 1
          setCurrentPage(1);
          filtered = filtered.filter(
            (product) => Number(product.newPrice) <= maxPrice
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
        // Lọc sản phẩm theo type
        if (selectedType.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedType.includes(product.infomation.type)
          );
        }
        // Lọc sản phẩm theo inch
        if (selectedInch.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedInch.includes(Number(product.infomation.inch))
          );
        }
        // Lọc sản phẩm theo resolution
        if (selectedResolution.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedResolution.includes(product.infomation.resolution)
          );
        }
        // Lọc sản phẩm theo Hz
        if (selectedHz.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedHz.includes(Number(product.infomation.hz))
          );
        }
        // Lọc sản phẩm theo core intel
        if (selectedCore.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedCore.includes(product.infomation.cpu)
          );
        }
        // Lọc sản phẩm theo chip ultra
        if (selectedUltra.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedUltra.includes(product.infomation.cpu)
          );
        }
        // Lọc sản phẩm theo chip AMD
        if (selectedAmd.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedAmd.includes(product.infomation.cpu)
          );
        }
        // Lọc sản phẩm theo chip M
        if (selectedApple.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedApple.includes(product.infomation.cpu)
          );
        }
        // Set state sau khi lọc
        setFilteredProducts(filtered);
      }
    }
  }, [
    isMobile,
    selectedBrands,
    data,
    minPrice,
    maxPrice,
    selectedRam,
    selectedStorage,
    selectedType,
    selectedInch,
    selectedResolution,
    selectedHz,
    selectedCore,
    selectedUltra,
    selectedAmd,
    selectedApple,
  ]);

  const handleBrandChange = (e) => {
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
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
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
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
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
    const storage = Number(e.target.value);
    setCurrentPage(1);
    setSelectedStorage((prevSelectedStorage) =>
      prevSelectedStorage.includes(storage)
        ? prevSelectedStorage.filter((a) => a !== storage)
        : [...prevSelectedStorage, storage]
    );
  };
  // Hàm xử lí khi chọn 1 hoặc nhiều tpye thể loại laptops
  const handleTypeChange = (e) => {
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
    const type = e.target.value;
    // Xử lí khi chọn option thì cho page hiện tại là 1
    setCurrentPage(1);
    setSelectedType((prevSelectedType) =>
      prevSelectedType.includes(type)
        ? prevSelectedType.filter((t) => t !== type)
        : [...prevSelectedType, type]
    );
  };
  // Hàm xử lí khi chọn 1 hoặc nhiều loại màn hình theo inch
  const handleInchChange = (e) => {
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
    const inch = Number(e.target.value);
    // Xử lí khi chọn option thì cho page hiện tại là 1
    setCurrentPage(1);
    setSelectedInch((prevSelectedInch) =>
      prevSelectedInch.includes(inch)
        ? prevSelectedInch.filter((i) => i !== inch)
        : [...prevSelectedInch, inch]
    );
  };
  // Hàm xử lí khi chọn 1 hoặc nhiều loại resolution
  const handleResolutionChange = (e) => {
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
    const resolution = e.target.value;
    // Xử lí khi chọn option thì cho page hiện tại là 1
    setCurrentPage(1);
    setSelectedResolution((prevSelectedResolution) =>
      prevSelectedResolution.includes(resolution)
        ? prevSelectedResolution.filter((r) => r !== resolution)
        : [...prevSelectedResolution, resolution]
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
  // Hàm xử lí khi chọn 1 hoặc nhiều loại chip core intel
  const handleCoreChange = (e) => {
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
    const core = e.target.value;
    // Xử lí khi chọn option thì cho page hiện tại là 1
    setCurrentPage(1);
    setSelectedCore((prevSelectedCore) =>
      prevSelectedCore.includes(core)
        ? prevSelectedCore.filter((c) => c !== core)
        : [...prevSelectedCore, core]
    );
  };
  // Hàm xử lí khi chọn 1 hoặc nhiều loại chip ultra đời mới
  const handleUltraChange = (e) => {
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
    const ultra = e.target.value;
    // Xử lí khi chọn option thì cho page hiện tại là 1
    setCurrentPage(1);
    setSelectedUltra((prevSelectedCore) =>
      prevSelectedCore.includes(ultra)
        ? prevSelectedCore.filter((c) => c !== ultra)
        : [...prevSelectedCore, ultra]
    );
  };
  // Hàm xử lí khi chọn 1 hoặc nhiều loại chip AMD
  const handleAmdChange = (e) => {
    const amd = e.target.value;
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
    setCurrentPage(1);
    setSelectedAmd((prevSelectedCore) =>
      prevSelectedCore.includes(amd)
        ? prevSelectedCore.filter((c) => c !== amd)
        : [...prevSelectedCore, amd]
    );
  };
  // Hàm xử lí khi chọn 1 hoặc nhiều loại chip Apple
  const handleAppleChange = (e) => {
    if (isMobile) {
    } else {
      window.scrollTo(0, 0);
    }
    const apple = e.target.value;
    setCurrentPage(1);
    setSelectedApple((prevSelectedCore) =>
      prevSelectedCore.includes(apple)
        ? prevSelectedCore.filter((c) => c !== apple)
        : [...prevSelectedCore, apple]
    );
  };
  // Hàm xử lí khi người dùng nhập price là số âm
  const preventNegativeInput = (e) => {
    if (e.target.value < 0) {
      e.target.value = 0;
    }
  };
  //   Phân trang
  // Tìm ra vị trí cuối của product 1 * 15 = 15
  const lastPostIndex = currentPage * postsPerPage;
  // Tìm ra vị trí đầu của product 15 - 15 = 0
  const firstPostIndex = lastPostIndex - postsPerPage;
  // Lấy ra những products từ vị trí đầu tới cuối 0 - 15
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
  // Hàm khi người dùng chọn show để filter ra sản phẩm phù hợp
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
        // Lọc sản phẩm theo type
        if (selectedType.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedType.includes(product.infomation.type)
          );
        }
        // Lọc sản phẩm theo inch
        if (selectedInch.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedInch.includes(Number(product.infomation.inch))
          );
        }
        // Lọc sản phẩm theo resolution
        if (selectedResolution.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedResolution.includes(product.infomation.resolution)
          );
        }
        // Lọc sản phẩm theo Hz
        if (selectedHz.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedHz.includes(Number(product.infomation.hz))
          );
        }
        // Lọc sản phẩm theo core intel
        if (selectedCore.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedCore.includes(product.infomation.cpu)
          );
        }
        // Lọc sản phẩm theo chip ultra
        if (selectedUltra.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedUltra.includes(product.infomation.cpu)
          );
        }
        // Lọc sản phẩm theo chip AMD
        if (selectedAmd.length > 0) {
          setCurrentPage(1);
          filtered = filtered.filter((product) =>
            selectedAmd.includes(product.infomation.cpu)
          );
        }
        // Lọc sản phẩm theo chip M
        if (selectedApple.length > 0) {
          setCurrentPage(1);

          filtered = filtered.filter((product) =>
            selectedApple.includes(product.infomation.cpu)
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
      selectedAmd.length > 0 ||
      selectedApple.length > 0 ||
      selectedBrands.length > 0 ||
      selectedCore.length > 0 ||
      selectedHz.length > 0 ||
      selectedInch.length > 0 ||
      selectedRam.length > 0 ||
      selectedResolution.length > 0 ||
      selectedStorage.length > 0 ||
      selectedType.length > 0 ||
      selectedUltra.length > 0
    ) {
      setClearFilter(false);
    } else {
      setClearFilter(true);
    }
  }, [
    priceRange,
    selectedAmd,
    selectedApple,
    selectedBrands,
    selectedCore,
    selectedHz,
    selectedInch,
    selectedRam,
    selectedResolution,
    selectedStorage,
    selectedType,
    selectedUltra,
  ]);
  // Hàm clear filter
  const clearFiler = () => {
    setClearFilter(true);
    setPriceRange(0);
    setSelectedBrands([]);
    setSelectedAmd([]);
    setSelectedApple([]);
    setSelectedCore([]);
    setSelectedHz([]);
    setSelectedInch([]);
    setSelectedRam([]);
    setSelectedResolution([]);
    setSelectedStorage([]);
    setSelectedType([]);
    setSelectedUltra([]);
  };
  // Hàm đếm số filter
  const countSelectedFilters = () => {
    return (
      (priceRange > 0 ? 1 : 0) +
      (selectedAmd.length > 0 ? selectedAmd.length : 0) +
      (selectedApple.length > 0 ? selectedApple.length : 0) +
      (selectedBrands.length > 0 ? selectedBrands.length : 0) +
      (selectedCore.length > 0 ? selectedCore.length : 0) +
      (selectedHz.length > 0 ? selectedHz.length : 0) +
      (selectedInch.length > 0 ? selectedInch.length : 0) +
      (selectedRam.length > 0 ? selectedRam.length : 0) +
      (selectedResolution.length > 0 ? selectedResolution.length : 0) +
      (selectedStorage.length > 0 ? selectedStorage.length : 0) +
      (selectedType.length > 0 ? selectedType.length : 0) +
      (selectedUltra.length > 0 ? selectedUltra.length : 0)
    );
  };

  if (isError) {
    return <Error />;
  }
  return (
    <div className="lg:px-[135px] bg-[#ffff]">
      <Nav />
      <>
        <div className="lg:py-[80px] py-[40px] px-[20px]">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
              Categories
            </span>
            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
              /
            </span>
            <span className="text-black text-[14px] font-normal  leading-[21px]">
              Laptops
            </span>
          </div>
        </div>
        <div className="pb-[140px] px-[20px] flex gap-4 lg:flex-row flex-col">
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
          {/* Filter Mobile */}
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
                {/* Type */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">Type</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {Type.map((type) => (
                      <label
                        key={type}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedType.includes(type)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={type}
                          name={type}
                          value={type}
                          className={`absolute opacity-0`}
                          onChange={handleTypeChange}
                          checked={selectedType.includes(type)}
                        />
                        <span className="text-[12px] font-medium">{type}</span>
                      </label>
                    ))}
                  </form>
                </div>
                {/* Inchs */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">Inchs</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {Inch.map((inch) => (
                      <label
                        key={inch}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedInch.includes(inch)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={inch}
                          name={inch}
                          value={inch}
                          className={`absolute opacity-0`}
                          onChange={handleInchChange}
                          checked={selectedInch.includes(inch)}
                        />
                        <span className="text-[12px] font-medium">{inch}</span>
                      </label>
                    ))}
                  </form>
                </div>
                {/* Resolution */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">Resolution</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {Resolution.map((res) => (
                      <label
                        key={res}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedResolution.includes(res)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={res}
                          name={res}
                          value={res}
                          className={`absolute opacity-0`}
                          onChange={handleResolutionChange}
                          checked={selectedResolution.includes(res)}
                        />
                        <span className="text-[12px] font-medium">{res}</span>
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
                {/* Chip Intel Core */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">Intel</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {Core.map((core) => (
                      <label
                        key={core}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedCore.includes(core)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={core}
                          name={core}
                          value={core}
                          className={`absolute opacity-0`}
                          onChange={handleCoreChange}
                          checked={selectedCore.includes(core)}
                        />
                        <span className="text-[12px] font-medium">{core}</span>
                      </label>
                    ))}
                  </form>
                </div>
                {/* Chip Intel Ultra */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">Intel Ultra</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {Ultra.map((ultra) => (
                      <label
                        key={ultra}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedUltra.includes(ultra)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={ultra}
                          name={ultra}
                          value={ultra}
                          className={`absolute opacity-0`}
                          onChange={handleUltraChange}
                          checked={selectedUltra.includes(ultra)}
                        />
                        <span className="text-[12px] font-medium">{ultra}</span>
                      </label>
                    ))}
                  </form>
                </div>
                {/* Chip Ryzen */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">AMD</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {Ryzen.map((ryzen) => (
                      <label
                        key={ryzen}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedAmd.includes(ryzen)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={ryzen}
                          name={ryzen}
                          value={ryzen}
                          className={`absolute opacity-0`}
                          onChange={handleAmdChange}
                          checked={selectedAmd.includes(ryzen)}
                        />
                        <span className="text-[12px] font-medium">{ryzen}</span>
                      </label>
                    ))}
                  </form>
                </div>
                {/* Chip M */}
                <div className="flex flex-col gap-2 py-3">
                  <span className="font-medium">Apple</span>
                  <form
                    action=""
                    className="flex gap-x-3 gap-y-4 flex-wrap"
                  >
                    {Apple.map((apple) => (
                      <label
                        key={apple}
                        className={` flex items-center justify-center relative cursor-pointer
        px-3 py-1 bg-gray-200 border-2  rounded-md transition-colors
         ${
           selectedApple.includes(apple)
             ? " border-blue-500 text-blue-500 bg-blue-100"
             : ""
         }`}
                      >
                        <input
                          type="checkbox"
                          id={apple}
                          name={apple}
                          value={apple}
                          className={`absolute opacity-0`}
                          onChange={handleAppleChange}
                          checked={selectedApple.includes(apple)}
                        />
                        <span className="text-[12px] font-medium">{apple}</span>
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
          {/* Filter của desktop */}
          <div className="px-3 lg:flex lg:flex-col hidden">
            {/* BRAND LAPTOP */}
            <div className="border-t-2 border-[gray-500] py-3">
              <div>
                <span className="text-[17px] lg:block font-semibold leading-[21px] hidden">
                  Brand
                </span>
                <form
                  action=""
                  className="lg:grid lg:grid-cols-2 py-3 gap-3 hidden "
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
            {/* PRICE LAPTOP */}
            <div className="border-t-2 border-[gray-500] py-3">
              <div className="">
                <span className="text-[17px] font-semibold  leading-[21px]">
                  Price, $ USD
                </span>
                <form
                  action=""
                  className="flex flex-col py-3 "
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
                        htmlFor="maxPrice"
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
            <div className="lg:flex lg:flex-col grid scroll-slides-filter">
              {/* RAM LAPTOP */}
              <div className="border-t-2 border-[gray-500] py-3">
                <div className="">
                  <span className="text-[17px] lg:block font-semibold leading-[21px] hidden">
                    RAM
                  </span>
                  <form
                    action=""
                    className=" lg:flex-col py-3 lg:flex hidden"
                  >
                    <div className="lg:grid lg:grid-cols-2 gap-3">
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
                              checked={selectedRam.includes(ram)}
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
              {/* HARD DRIVE LAPTOP*/}
              <div className="border-t-2 border-[gray-500] py-3">
                <div>
                  <span className="text-[17px] font-semibold leading-[21px] hidden lg:block">
                    Hard Drive
                  </span>

                  <form
                    action=""
                    className="lg:grid hidden lg:grid-cols-2 py-3 lg:gap-3 gap-2 "
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
                          {storage === 1 || storage === 2
                            ? `${storage} TB`
                            : `${storage} GB`}
                        </label>
                      </div>
                    ))}
                  </form>
                </div>
              </div>
              {/* TYPE LAPTOP */}
              <div className="border-t-2 border-[gray-500] py-3">
                <div>
                  <span className="text-[17px] font-semibold leading-[21px] hidden lg:block">
                    Type
                  </span>

                  <form className="lg:grid hidden lg:grid-cols-2 py-3 gap-y-2">
                    {Type.map((type, index) => (
                      <div
                        className="flex items-center gap-3"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          id={type}
                          name={type}
                          value={type}
                          className="size-4 hover:cursor-pointer"
                          onChange={handleTypeChange}
                        />
                        <label
                          htmlFor={type}
                          className="text-[15px] font-medium leading-[24px]"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </form>
                </div>
              </div>
              {/* INCHS LAPTOP */}
              <div className="border-t-2 border-[gray-500] py-3">
                <div>
                  <span className="text-[17px] font-semibold leading-[21px] lg:block hidden">
                    Inchs
                  </span>

                  <form
                    action=""
                    className="lg:grid hidden lg:grid-cols-2 py-3 gap-3 "
                  >
                    {Inch.map((inch, index) => (
                      <div
                        className="flex items-center gap-3"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          id={inch}
                          name={inch}
                          value={inch}
                          className="size-4 hover:cursor-pointer"
                          onChange={handleInchChange}
                          checked={selectedInch.includes(inch)}
                        />
                        <label
                          htmlFor={inch}
                          className="text-[15px] font-medium leading-[24px]"
                        >
                          {`${inch} Inch`}
                        </label>
                      </div>
                    ))}
                  </form>
                </div>
              </div>
              {/* RESOLUTION LAPTOP */}
              <div className="border-t-2 border-[gray-500] py-3">
                <div>
                  <span className="text-[17px] font-semibold lg:block hidden leading-[21px]">
                    Resolutions
                  </span>

                  <form
                    action=""
                    className="lg:grid hidden lg:grid-cols-2 py-3 gap-y-2 "
                  >
                    {Resolution.map((res, index) => (
                      <div
                        className="flex items-center gap-3"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          id={res}
                          name={res}
                          value={res}
                          className="size-4 hover:cursor-pointer"
                          onChange={handleResolutionChange}
                          checked={selectedResolution.includes(res)}
                        />
                        <label
                          htmlFor={res}
                          className="text-[15px] font-medium leading-[24px]"
                        >
                          {res}
                        </label>
                      </div>
                    ))}
                  </form>
                </div>
              </div>
              {/* HZ LAPTOP */}
              <div className="border-t-2 border-[gray-500] py-3">
                <div>
                  <span className="text-[17px] font-semibold leading-[21px] lg:block hidden">
                    Hz
                  </span>

                  <form className="lg:grid hidden lg:grid-cols-2 py-3 gap-3">
                    {Hz.map((hz, index) => (
                      <div
                        className="flex items-center gap-3"
                        key={index}
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
                          {`${hz} Hz`}
                        </label>
                      </div>
                    ))}
                  </form>
                </div>
              </div>
            </div>
            {/* CPU LAPTOP */}
            <div className="border-t-2 border-[gray-500] py-3">
              <div>
                <div className="flex flex-col gap-2 w-fit">
                  <span className="text-[17px] font-semibold leading-[21px] ">
                    CPU
                  </span>
                  <span className="font-medium text-[17px] lg:block hidden">
                    Chip Intel Core
                  </span>
                </div>
                <div className="grid scroll-slides-filter lg:flex lg:flex-col py-3">
                  {/* Chip Intel */}
                  <form
                    action=""
                    className="hidden py-3 gap-3 lg:grid lg:grid-cols-2"
                  >
                    {Core.map((core, index) => (
                      <div
                        className="flex items-center gap-3"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          id={core}
                          name={core}
                          value={core}
                          className="size-4 hover:cursor-pointer"
                          onChange={handleCoreChange}
                          checked={selectedCore.includes(core)}
                        />
                        <label
                          htmlFor={core}
                          className="text-[15px] font-medium leading-[24px]"
                        >
                          {core}
                        </label>
                      </div>
                    ))}
                  </form>
                  <span className="font-medium text-[17px] lg:block hidden">
                    Chip Intel Core Ultra
                  </span>
                  {/* Chip Intel Ultra */}
                  <form
                    action=""
                    className="hidden lg:grid lg:grid-cols-2 py-3 gap-3"
                  >
                    {Ultra.map((ultra, index) => (
                      <div
                        className="flex items-center gap-3"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          id={ultra}
                          name={ultra}
                          value={ultra}
                          className="size-4 hover:cursor-pointer"
                          onChange={handleUltraChange}
                          checked={selectedUltra.includes(ultra)}
                        />
                        <label
                          htmlFor={ultra}
                          className="text-[15px] font-medium leading-[24px]"
                        >
                          {ultra}
                        </label>
                      </div>
                    ))}
                  </form>
                  <span className="font-medium text-[17px] hidden lg:block">
                    Chip AMD
                  </span>
                  {/* Chip AMD */}

                  <form
                    action=""
                    className="lg:grid hidden lg:grid-cols-2 py-3 gap-3"
                  >
                    {Ryzen.map((ryzen, index) => (
                      <div
                        className="flex items-center gap-3"
                        key={index}
                      >
                        <input
                          type="checkbox"
                          id={ryzen}
                          name={ryzen}
                          value={ryzen}
                          className="size-4 hover:cursor-pointer"
                          onChange={handleAmdChange}
                          checked={selectedAmd.includes(ryzen)}
                        />
                        <label
                          htmlFor={ryzen}
                          className="text-[15px] font-medium leading-[24px]"
                        >
                          {ryzen}
                        </label>
                      </div>
                    ))}
                  </form>
                  <span className="font-medium text-[17px] lg:block hidden">
                    Chip Apple
                  </span>
                  {/* Chip Apple */}
                  <form
                    action=""
                    className="lg:grid hidden lg:grid-cols-2 py-3 gap-y-3"
                  >
                    {Apple.map((apple, index) => (
                      <div
                        className={`flex items-center gap-3 ${
                          index === Apple.length - 1 ? "col-span-2" : ""
                        }`}
                        key={index}
                      >
                        <input
                          type="checkbox"
                          id={apple}
                          name={apple}
                          value={apple}
                          className="size-4 hover:cursor-pointer"
                          onChange={handleAppleChange}
                          checked={selectedApple.includes(apple)}
                        />
                        <label
                          htmlFor={apple}
                          className="text-[15px] font-medium leading-[24px]"
                        >
                          {apple}
                        </label>
                      </div>
                    ))}
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full py-4">
            {isLoading ? (
              <div className="grid lg:grid-cols-3 grid-cols-1 gap-x-[30px] gap-y-[40px]">
                {Array.from({ length: currentPosts.length || 15 }).map(
                  (_, index) => (
                    <SkeletonCard key={index} />
                  )
                )}
              </div>
            ) : (
              <>
                <ListLaptops filteredProducts={currentPosts} />
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
        <Footer />
        <ToastContainer />
      </>
    </div>
  );
};
export default Laptops;
