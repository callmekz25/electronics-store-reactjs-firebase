import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import { Error } from "./Error";
import { ListLaptops } from "../components/ListLaptops";
import { Pagination } from "../components/Pagination";
import { ToastContainer } from "react-toastify";
import { fetchProductsLaptop } from "../FetchAPI/FetchAPI";
import { useQuery } from "@tanstack/react-query";
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
    const [maxPrice, setMaxPrice] = useState();
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
    // State cho pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(15);

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
    const brandsName = [
        "Dell",
        "Asus",
        "Acer",
        "Lenovo",
        "Macbook",
        "Hp",
        "Msi",
    ];
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
    const Resolution = [
        "Full HD",
        "2K",
        "2.8K",
        "4K",
        "Retina",
        "Liquid Retina",
    ];

    // Mảng chứa tần số quét Hz
    const Hz = [60, 90, 120, 144, 165, 240];
    // Mảng chứa loại lap
    const Type = ["Office Learn", "Thin Light", "Gaming"];
    const { data, isLoading, isError } = useQuery({
        queryKey: [`products`],
        queryFn: fetchProductsLaptop,
    });
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        if (data) {
            let filtered = data;
            // Lọc sản phẩm theo brand
            if (selectedBrands.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedBrands.includes(product.brand)
                );
            }
            // Lọc sản phẩm theo giá tiền

            if (minPrice > 0 && maxPrice < 100000) {
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
                filtered = filtered.filter((product) =>
                    selectedRam.includes(Number(product.infomation.ram))
                );
            }
            // Lọc sản phẩm theo storage
            if (selectedStorage.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedStorage.includes(
                        Number(product.infomation.hardDrive)
                    )
                );
            }
            // Lọc sản phẩm theo type
            if (selectedType.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedType.includes(product.infomation.type)
                );
            }
            // Lọc sản phẩm theo inch
            if (selectedInch.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedInch.includes(Number(product.infomation.inch))
                );
            }
            // Lọc sản phẩm theo resolution
            if (selectedResolution.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedResolution.includes(product.infomation.resolution)
                );
            }
            // Lọc sản phẩm theo Hz
            if (selectedHz.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedHz.includes(Number(product.infomation.hz))
                );
            }
            // Lọc sản phẩm theo core intel
            if (selectedCore.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedCore.includes(product.infomation.cpu)
                );
            }
            // Lọc sản phẩm theo chip ultra
            if (selectedUltra.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedUltra.includes(product.infomation.cpu)
                );
            }
            // Lọc sản phẩm theo chip AMD
            if (selectedAmd.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedAmd.includes(product.infomation.cpu)
                );
            }
            // Lọc sản phẩm theo chip M
            if (selectedApple.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedApple.includes(product.infomation.cpu)
                );
            }
            // Set state sau khi lọc
            setFilteredProducts(filtered);
        }
    }, [
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
    // Hàm xử lí khi chọn 1 hoặc nhiều tpye thể loại laptops
    const handleTypeChange = (e) => {
        window.scrollTo(0, 0);
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
        window.scrollTo(0, 0);
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
        window.scrollTo(0, 0);
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
        window.scrollTo(0, 0);
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
        window.scrollTo(0, 0);
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
        window.scrollTo(0, 0);
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
        window.scrollTo(0, 0);
        setCurrentPage(1);
        setSelectedAmd((prevSelectedCore) =>
            prevSelectedCore.includes(amd)
                ? prevSelectedCore.filter((c) => c !== amd)
                : [...prevSelectedCore, amd]
        );
    };
    // Hàm xử lí khi chọn 1 hoặc nhiều loại chip Apple
    const handleAppleChange = (e) => {
        window.scrollTo(0, 0);
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
    // Phân trang
    // Tìm ra vị trí cuối của product 1 * 15 = 15
    const lastPostIndex = currentPage * postsPerPage;
    // Tìm ra vị trí đầu của product 15 - 15 = 0
    const firstPostIndex = lastPostIndex - postsPerPage;
    // Lấy ra những products từ vị trí đầu tới cuối 0 - 15
    const currentPosts = filteredProducts.slice(firstPostIndex, lastPostIndex);
    if (isError) {
        return <Error />;
    }
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Nav />
                    <div className="lg:px-[135px] lg:py-[80px]">
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
                    <div className="pb-[140px] flex px-[135px] gap-4">
                        <div className="px-3 flex flex-col">
                            <div className="border-t-2 border-[gray-500] py-3">
                                <div>
                                    <span className="text-[17px] font-semibold leading-[21px]">
                                        Brand
                                    </span>
                                    <form
                                        action=""
                                        className="flex flex-col py-3 gap-3"
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
                                                    checked={selectedBrands.includes(
                                                        brandName
                                                    )}
                                                />
                                                <label
                                                    htmlFor={brandName}
                                                    className="text-[15px] font-medium leading-[24px]"
                                                >
                                                    {brandName
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        brandName.slice(1)}
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
                                                        setMinPrice(
                                                            e.target.value
                                                        );
                                                    }}
                                                    onInput={
                                                        preventNegativeInput
                                                    }
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
                                                        setMaxPrice(
                                                            e.target.value
                                                        );
                                                    }}
                                                    onInput={
                                                        preventNegativeInput
                                                    }
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
                                        <div className="flex justify-start gap-3 flex-col">
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
                                                            onChange={
                                                                handleRamChange
                                                            }
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
                            <div className="border-t-2 border-[gray-500] py-3">
                                <div>
                                    <span className="text-[17px] font-semibold leading-[21px]">
                                        Hard Drive
                                    </span>
                                    <form
                                        action=""
                                        className="flex flex-col py-3 gap-3"
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
                                                    onChange={
                                                        handleStorageChange
                                                    }
                                                />
                                                <label
                                                    htmlFor={storage}
                                                    className="text-[15px] font-medium leading-[24px]"
                                                >
                                                    {storage === 1 ||
                                                    storage === 2
                                                        ? `${storage} TB`
                                                        : `${storage} GB`}
                                                </label>
                                            </div>
                                        ))}
                                    </form>
                                </div>
                            </div>
                            <div className="border-t-2 border-[gray-500] py-3">
                                <div>
                                    <span className="text-[17px] font-semibold leading-[21px]">
                                        Type
                                    </span>
                                    <form
                                        action=""
                                        className="flex flex-col py-3 gap-3"
                                    >
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
                            <div className="border-t-2 border-[gray-500] py-3">
                                <div>
                                    <span className="text-[17px] font-semibold leading-[21px]">
                                        Inchs
                                    </span>
                                    <form
                                        action=""
                                        className="flex flex-col py-3 gap-3"
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
                            <div className="border-t-2 border-[gray-500] py-3">
                                <div>
                                    <span className="text-[17px] font-semibold leading-[21px]">
                                        Resolutions
                                    </span>
                                    <form
                                        action=""
                                        className="flex flex-col py-3 gap-3"
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
                                                    onChange={
                                                        handleResolutionChange
                                                    }
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
                            <div className="border-t-2 border-[gray-500] py-3">
                                <div>
                                    <span className="text-[17px] font-semibold leading-[21px]">
                                        Hz
                                    </span>
                                    <form
                                        action=""
                                        className="flex flex-col py-3 gap-3"
                                    >
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
                            <div className="border-t-2 border-[gray-500] py-3">
                                <div>
                                    <span className="text-[17px] font-semibold leading-[21px]">
                                        CPU
                                    </span>
                                    <form
                                        action=""
                                        className="flex flex-col py-3 gap-3"
                                    >
                                        <span>Intel Core</span>
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
                                    <form
                                        action=""
                                        className="flex flex-col py-3 gap-3"
                                    >
                                        <span>Intel Core Ultra</span>
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
                                    <form
                                        action=""
                                        className="flex flex-col py-3 gap-3"
                                    >
                                        <span>AMD</span>
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
                                    <form
                                        action=""
                                        className="flex flex-col py-3 gap-3"
                                    >
                                        <span>Apple</span>
                                        {Apple.map((apple, index) => (
                                            <div
                                                className="flex items-center gap-3"
                                                key={index}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={apple}
                                                    name={apple}
                                                    value={apple}
                                                    className="size-4 hover:cursor-pointer"
                                                    onChange={handleAppleChange}
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
                        {isLoading ? (
                            <Loading />
                        ) : (
                            <div className="w-full">
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
                            </div>
                        )}
                    </div>
                    <Footer />
                    <ToastContainer />
                </>
            )}
        </>
    );
};
export default Laptops;
