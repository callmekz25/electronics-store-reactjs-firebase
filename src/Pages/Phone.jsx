import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading";
import { Error } from "./Error";
import { ToastContainer } from "react-toastify";
import { Pagination } from "../components/Pagination";
import { ListPhones } from "../components/ListPhones";
import { useQuery } from "@tanstack/react-query";
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
    // State để set mức min max giá tiền
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(null);
    // State cho pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(6);
    // Mảng chứa các brand cho phones
    const brandsName = ["iphone", "samsung", "xiaomi", "vivo", "oppo"];
    // Mảng chứa ram
    const Ram = [3, 4, 6, 8, 12, 16];
    // Mảng chứa dung lượng lữu trữ
    const Storage = [64, 128, 256, 512, 1];
    // Hàm lấy ra những sản phẩm là phone
    const { data, isLoading, isError } = useQuery({
        queryKey: [`productsPhone`],
        queryFn: fetchProductsPhone,
    });
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
    // Xử lí nếu có filter theo brand thì lấy ra các phones cùng brand đã select còn không thì render tất cả các phones
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
    if (isError) {
        return <Error />;
    }
    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="">
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
                                Phones
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
                                        Storage
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
                                                    checked={selectedStorage.includes(
                                                        storage
                                                    )}
                                                />
                                                <label
                                                    htmlFor={storage}
                                                    className="text-[15px] font-medium leading-[24px]"
                                                >
                                                    {storage === 1
                                                        ? `${storage} TB`
                                                        : `${storage} GB`}
                                                </label>
                                            </div>
                                        ))}
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
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
                        </div>
                    </div>
                    <Footer />
                </div>
            )}
            <ToastContainer />
        </>
    );
};
export default Phones;
