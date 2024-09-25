import SideBar from "../components/SideBar";
import { useContext, useEffect, useRef, useState } from "react";
import {
  deleteObject,
  listAll,
  ref as sRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import {
  PencilSquareIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { Loading } from "../components/Loading";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "../FetchAPI/FetchAPI";
import { Error } from "./Error";
import { UserContext } from "../Context/UserContext";
const ProductsList = () => {
  // State update thông tin của product
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [sales, setSales] = useState("");
  const [isSale, setIsSale] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [color3, setColor3] = useState("");
  const [color4, setColor4] = useState("");
  const [color5, setColor5] = useState("");
  const [infomation, setInfomation] = useState({
    resolution: "",
    card: "",
    connector: "",
    cpu: "",
    hardDrive: "",
    hz: "",
    inch: "",
    pin: "",
    ram: "",
    type: "",
    weight: "",
  });
  const [infomationPhone, setInfomationPhone] = useState({
    resolution: "",
    behindCamera: "",
    connector: "",
    cpu: "",
    hardDrive: "",
    hz: "",
    inch: "",
    pin: "",
    ram: "",
    frontCamera: "",
    weight: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterByBrand, setFilterByBrand] = useState("");
  const [filterByCategory, setFilterByCategory] = useState("");
  const [filterByPrice, setFilterByPrice] = useState("");
  const [filterBySales, setFilterBySales] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [productWantDelete, setProductWantDelete] = useState("");
  const [productEdit, setProductEdit] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [imgPreview, setImgPreview] = useState([]);
  const { user, loading } = useContext(UserContext);
  const filterRef = useRef("");
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchAllProducts(user),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (products) {
      setAllProducts(products);
    }
  }, [products]);
  const handleInfomation = (e) => {
    const { name, value } = e.target;
    setInfomation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleInfomationPhone = (e) => {
    const { name, value } = e.target;
    setInfomationPhone((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Xử lí xóa product khỏi database
  const handleDeleteProduct = async (productId) => {
    try {
      const productRef = doc(db, "All-products", productId);
      // Lấy ra folder ảnh của product
      const imageRef = sRef(storage, `images/image ${productId}`);
      // Lấy ra list ảnh của product
      const listImages = await listAll(imageRef);
      // Lặp qua và xóa ảnh
      const deleteListImages = listImages.items.map((item) =>
        deleteObject(item)
      );
      // Đợi tất cả ảnh được xóa
      await Promise.all(deleteListImages);
      await deleteDoc(productRef);
      if (deleteDoc) {
        toast.success("Delete product successfully!");
        // Update product sau khi delete
        setAllProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      }
    } catch (e) {
      toast.error("Cann't delete product!");
    }
  };
  // Hàm remove url preview để tránh bị rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      for (let i = 0; i < imgPreview.length; i++) {
        URL.revokeObjectURL(imgPreview[i].preview);
      }
    };
  }, [imgPreview]);

  // Xử lí lấy ảnh từ input và preview ra
  const handlePreviewImg = (e) => {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
    }
    setImgPreview(files);
  };

  const handleUpdateProduct = async (product) => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    const currentDay = `${day}/${month}/${year} ${hour}:${minute}`;
    const urls = [];
    if (imgPreview.length > 0) {
      // Lấy ra ref của storage lưu folder images
      const imageListRef = sRef(storage, `images/image ${product.id}`);
      const listImages = await listAll(imageListRef);
      // Lặp qua và xóa ảnh
      const deleteListImages = listImages.items.map((item) =>
        deleteObject(item)
      );
      // Đợi tất cả ảnh được xóa
      await Promise.all(deleteListImages);

      // Update ảnh mới lên folder cũ vừa xóa các ảnh trên
      for (let i = 0; i < imgPreview.length; i++) {
        const imageRef = sRef(
          storage,
          `images/image ${product.id}/${imgPreview[i].name + uuid()}`
        );
        await uploadBytes(imageRef, imgPreview[i]).then(() => {
          console.log("Update images success!");
        });
        // Lấy ra url của từng ảnh và đẩy vô 1 mảng để lưu trữ được ảnh theo thứ tự mong muốn
        const url = await getDownloadURL(imageRef);
        urls.push(url);
      }
    }
    let info = {};
    if (product.cate === "laptop") {
      info = {
        type: infomation.type,
        resolution: infomation.resolution,
        inch: infomation.inch,
        connector: infomation.connector,
        ram: infomation.ram,
        hardDrive: infomation.hardDrive,
        cpu: infomation.cpu,
        pin: infomation.pin,
        hz: infomation.hz,
        card: infomation.card,
        weight: infomation.weight,
      };
    } else if (product.cate === "phone") {
      info = {
        behindCamera:
          infomationPhone.behindCamera || product.infomation.behindCamera,
        frontCamera:
          infomationPhone.frontCamera || product.infomation.frontCamera,
        resolution: infomationPhone.resolution || product.infomation.resolution,
        inch: infomationPhone.inch || product.infomation.inch,
        connector: infomationPhone.connector || product.infomation.connector,
        ram: infomationPhone.ram || product.infomation.ram,
        hardDrive: infomationPhone.hardDrive || product.infomation.hardDrive,
        cpu: infomationPhone.cpu || product.infomation.cpu,
        pin: infomationPhone.pin || product.infomation.pin,
        hz: infomationPhone.hz || product.infomation.hz,
        weight: infomationPhone.weight || product.infomation.weight,
      };
    }
    const docRef = doc(db, "All-products", product.id);
    const productDataUpdate = {
      name: name || product.name,
      img: urls || product.img,
      createdAt: currentDay || product.createdAt,
      brand: brand || product.brand,
      oldPrice: oldPrice || product.oldPrice,
      newPrice: newPrice || product.newPrice,
      colors: [color1, color2, color3, color4, color5],
      sales: sales || product.sales,
      isSale: isSale || product.isSale,
      infomation: info,
    };
    await updateDoc(docRef, productDataUpdate);
    for (let i = 0; i < imgPreview.length; i++) {
      URL.revokeObjectURL(imgPreview[i].preview);
    }
    if (updateDoc) {
      toast.success("Update successfully!", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };
  const handleDiscardUpdate = () => {
    setIsEdit(false);
    setProductEdit(null);
    setImgPreview([]);
    setName("");
    setBrand("");
    setSales("");
    setColor1(null);
    setColor2(null);
    setColor3(null);
    setColor4(null);
    setColor5(null);
    setIsSale("");
    setInfomation({
      resolution: "",
      card: "",
      connector: "",
      cpu: "",
      hardDrive: "",
      hz: "",
      inch: "",
      pin: "",
      ram: "",
      type: "",
      weight: "",
    });
    setInfomationPhone({
      resolution: "",
      behindCamera: "",
      connector: "",
      cpu: "",
      hardDrive: "",
      hz: "",
      inch: "",
      pin: "",
      ram: "",
      frontCamera: "",
      weight: "",
    });
  };
  // Khi bấm ngoài phần tử button filter thì ẩn
  const handleClickOutOfButtonFilter = (e) => {
    if (filterRef.current && !filterRef.current.contains(e.target)) {
      setActiveFilter(false);
    }
  };

  // Khi click ngoài popup filter thì tắt
  useEffect(() => {
    // Lắng nghe sự kiện khi nhấn chuột
    document.addEventListener("mousedown", handleClickOutOfButtonFilter);
    return () => {
      // Xóa sự kiện khi component unmount
      document.removeEventListener("mousedown", handleClickOutOfButtonFilter);
    };
  }, []);
  // Search product name
  const activeSearch = (e) => {
    applyFilter(e);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      applyFilter(e);
    }
  };

  // Filter list products
  const applyFilter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let filtered = products;
    if (searchValue) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          product.id.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (fromDate && toDate) {
      filtered = filtered.filter(
        (product) =>
          new Date(product.createdAt.split("/").reverse()) >=
            new Date(fromDate) &&
          new Date(product.createdAt.split("/").reverse()) <= new Date(toDate)
      );
    }
    if (filterByCategory) {
      filtered = filtered.filter(
        (product) => product.cate === filterByCategory
      );
    }
    if (filterByPrice) {
      const price = filterByPrice.split("-");
      const minPrice = Number(price[0]);
      const maxPrice = Number(price[1]);
      filtered = filtered.filter(
        (product) =>
          product.newPrice >= minPrice && product.newPrice <= maxPrice
      );
    }
    if (filterByBrand) {
      filtered = filtered.filter((product) => product.brand === filterByBrand);
    }
    if (filterBySales) {
      filtered = filtered.filter((product) => product.isSale === filterBySales);
    }
    setActiveFilter(false);
    setAllProducts(filtered);
  };

  // Reset all filter list products
  const handleResetFilter = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveFilter(false);
    setFilterByBrand("");
    setFilterByCategory("");
    setFilterByPrice(null);
    setFilterBySales(null);
    setFromDate(null);
    setToDate(null);
    setAllProducts(products);
  };

  if (isLoading || loading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  return (
    <div className="grid grid-cols-6">
      {/* Delete product popup */}
      {isDelete && (
        <div className="overlay">
          <div className=" w-[500px] bg-white rounded-md p-5 flex flex-col justify-between">
            <div className="">
              <h3 className="text-[25px] font-normal text-red-500">
                Are you sure want to delete product?
              </h3>
              <p className="text-[17px] text-gray-400 font-normal mt-10">
                If you confirm this action cannot be undone and this procut will
                be delete.
              </p>
            </div>
            <div className="flex items-center justify-end gap-4 mt-10">
              <button
                className="px-4 py-2 bg-red-500 border-2 border-red-500 rounded flex items-center justify-center text-white font-normal text-[15px] outline-none"
                onClick={() => {
                  setIsDelete(false);
                  handleDeleteProduct(productWantDelete.id);
                }}
              >
                Yes, cancel
              </button>
              <button
                className="px-8 py-2 border-2  rounded flex items-center justify-center text-gray-400 font-normal text-[15px] outline-none"
                onClick={() => {
                  setIsDelete(false);
                  setProductWantDelete(null);
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit product popup*/}
      {isEdit && (
        <div className="overlay">
          <div className=" bg-white rounded-md p-7 max-h-[650px] overflow-auto text-[#48505e] scrollbar-hide">
            <h3 className="text-[20px] font-medium ">Update product</h3>
            <div className="flex items-center gap-2 py-2">
              <span>Product ID:</span>
              <span>{productEdit.id}</span>
            </div>
            <div
              className="flex flex-col gap-[30px] py-[30px] font-medium
            "
            >
              <div className="flex flex-col gap-2 col-span-3">
                <input
                  type="file"
                  multiple="multiple"
                  onChange={(e) => handlePreviewImg(e)}
                />
                <div className="w-[400px] border border-gray-300 p-2 rounded">
                  <div className="flex items-center gap-3 flex-wrap">
                    {imgPreview &&
                      Array.from(imgPreview).map((img) => {
                        return (
                          <div className="size-[60px] flex items-center bg-[#f5f5f5] justify-center p-3 rounded-md">
                            <img
                              src={img.preview}
                              alt=""
                              className=" object-contain"
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              {productEdit.cate === "phone" && (
                <>
                  <div className="flex items-center justify-between ">
                    <label htmlFor="pName">Product Name</label>
                    <input
                      type="text"
                      id="pName"
                      className="outline-none border-2 border-[#d0d5dd] rounded-md px-3 py-2 font-normal w-[60%]"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pbrand">Brand</label>
                    <input
                      type="text"
                      id="pbrand"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Enter product brand"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="pcolor1">Color 1</label>
                      <input
                        type="color"
                        id="pcolor1"
                        className="outline-none border-2 border-gray-300 rounded-md size-14"
                        onChange={(e) => setColor1(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="pcolor2">Color 2</label>
                      <input
                        type="color"
                        id="pcolor2"
                        className="outline-none border-2 border-gray-300 rounded-md size-14"
                        onChange={(e) => setColor2(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="pcolor3">Color 3</label>
                      <input
                        type="color"
                        id="pcolor3"
                        className="outline-none border-2 border-gray-300 rounded-md size-14"
                        onChange={(e) => setColor3(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="pcolor4">Color 4</label>
                      <input
                        type="color"
                        id="pcolor4"
                        className="outline-none border-2 border-gray-300 rounded-md size-14"
                        onChange={(e) => setColor4(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="pcolor5">Color 5</label>
                      <input
                        type="color"
                        id="pcolor5"
                        className="outline-none border-2 border-gray-300 rounded-md size-14"
                        onChange={(e) => setColor5(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="pOldPrice">Old Price</label>
                    <input
                      type="number"
                      id="pOldPrice"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      onChange={(e) => setOldPrice(e.target.value)}
                      placeholder="Enter product old price"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pNewPrice">New Price</label>
                    <input
                      type="number"
                      id="pNewPrice"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Enter product new price"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="psales">Sales</label>
                    <input
                      type="text"
                      id="psales"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      placeholder="Enter sales product"
                      onChange={(e) => setSales(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pissale">Is Sale</label>
                    <div className="flex items-center gap-2">
                      <span>Not sale</span>
                      <input
                        type="radio"
                        id="pissale"
                        name="sale"
                        className="outline-none  size-4 hover:cursor-pointer"
                        onChange={() => setIsSale(false)}
                      />
                      <span>Sale</span>
                      <input
                        type="radio"
                        id="pissale"
                        name="sale"
                        className="outline-none size-4 hover:cursor-pointer"
                        onChange={() => setIsSale(true)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pFc">Front Camera</label>
                    <input
                      type="text"
                      name="frontCamera"
                      id="pFc"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      onChange={handleInfomationPhone}
                      placeholder="Enter front camera"
                      value={infomationPhone.frontCamera}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pBc">Behind Camera</label>
                    <input
                      type="text"
                      name="behindCamera"
                      id="pBc"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      onChange={handleInfomationPhone}
                      placeholder="Enter behind camera"
                      value={infomationPhone.behindCamera}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pres">Resolution</label>
                    <select
                      name="resolution"
                      id="pres"
                      onChange={handleInfomationPhone}
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                    >
                      <option value="">Enter product resolution</option>
                      <option value="QQVGA">QQVGA</option>
                      <option value="QVGA">QVGA</option>
                      <option value="QXGA+">QXGA+</option>
                      <option value="HD+">HD+</option>
                      <option value="Full HD+">Full HD+</option>
                      <option value="1.5K">1.5K</option>
                      <option value="1.5K+">1.5K+</option>
                      <option value="2K+">2K+</option>
                      <option value="Retina">Retina(iPhone)</option>
                      <option value="Super Retina XDR">Super Retina XDR</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pinch">Inch</label>
                    <input
                      type="text"
                      name="inch"
                      id="pinch"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      placeholder="Enter product inch"
                      onChange={handleInfomationPhone}
                      value={infomationPhone.inch}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="lconnector">Connector</label>
                    <input
                      type="text"
                      id="lconnector"
                      name="connector"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      placeholder="Enter product connector"
                      value={infomationPhone.connector}
                      onChange={handleInfomationPhone}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pram">Ram</label>
                    <select
                      name="ram"
                      id="pram"
                      onChange={handleInfomationPhone}
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                    >
                      <option value="">Enter product RAM</option>
                      <option value="3">3GB</option>
                      <option value="4">4GB</option>
                      <option value="6">6GB</option>
                      <option value="8">8GB</option>
                      <option value="16">12GB</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="phd">Hard Drive</label>
                    <select
                      name="hardDrive"
                      id="phd"
                      onChange={handleInfomationPhone}
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                    >
                      <option value="">Enter product storage</option>
                      <option value="64">64GB</option>
                      <option value="128">128GB</option>
                      <option value="256">256GB</option>
                      <option value="512">512GB</option>
                      <option value="1">1TB</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pcpu">CPU</label>
                    <input
                      type="text"
                      id="pcpu"
                      name="cpu"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      placeholder="Enter product cpu"
                      value={infomationPhone.cpu}
                      onChange={handleInfomationPhone}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="ppin">Pin</label>
                    <input
                      type="text"
                      id="ppin"
                      name="pin"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      placeholder="Enter product pin"
                      value={infomationPhone.pin}
                      onChange={handleInfomationPhone}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="phz">Hz</label>
                    <select
                      name="hz"
                      id="phz"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      onChange={handleInfomationPhone}
                    >
                      <option value="">Enter product hz</option>
                      <option value="60">60Hz</option>
                      <option value="90">90Hz</option>
                      <option value="120">120Hz</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pweight">Weight</label>
                    <input
                      type="number"
                      id="pweight"
                      name="weight"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2 font-normal w-[60%]"
                      placeholder="Enter product weight"
                      value={infomationPhone.weight}
                      onChange={handleInfomationPhone}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-4">
              <button
                className="px-8 py-2 border-2  rounded flex items-center justify-center text-gray-400 font-normal text-[15px] outline-none"
                onClick={() => handleDiscardUpdate()}
              >
                Discard
              </button>
              <button
                className="px-4 py-2 bg-[#1366d9] rounded flex items-center justify-center border-2 border-[#1366d9] text-white font-normal text-[15px] outline-none"
                onClick={() => {
                  setIsEdit(false);
                  handleUpdateProduct(productEdit);
                }}
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
      <SideBar isActive={"products"} />
      <div className={`bg-[#f0f1f3]  px-[50px] py-5 col-span-5`}>
        <div className="bg-[#ffffff] rounded-lg px-6 py-5 flex flex-col gap-5">
          <h3 className="text-[22px] font-medium">Overall</h3>
          <div className="grid grid-cols-4">
            <div className="flex flex-col justify-between font-medium">
              <span className="text-[#2278f0]">Categories</span>
              <span>14</span>
            </div>

            <div className="flex flex-col gap-4 border-l-2 border-gray-300 px-14 font-medium">
              <span className=" text-[#e59f4c]">Total Products</span>
              <div className="flex items-center justify-between">
                <span>14</span>
                <span>$20039</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-l-2 border-gray-300 px-14 font-medium">
              <span className=" text-[#9472c5]">Total Selling</span>
              <div className="flex items-center justify-between">
                <span>14</span>
                <span>$20039</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-l-2 border-gray-300 px-14 font-medium">
              <span className="">Total Products</span>
              <span>14</span>
            </div>
          </div>
        </div>
        <div className=" py-[50px]">
          <div className="bg-[#ffffff] rounded-lg py-5 px-3 w-full">
            <div className="flex items-center px-5 justify-between">
              <h2 className="text-[20px] font-medium">Products</h2>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="absolute size-5 left-2 top-[50%] translate-y-[-50%] text-[#9ca3af] hover:cursor-pointer"
                    onClick={(e) => activeSearch(e)}
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    className="border-2 rounded-lg px-8 py-[6px] outline-[#0047ff] w-full text-[14px]"
                    onChange={(e) => setSearchValue(e.target.value)}
                    value={searchValue}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                </div>
                {/* Filter */}
                <div className="flex items-center">
                  <div className="relative">
                    <button
                      className={`flex items-center gap-3 rounded-lg border-2  px-4 py-[6px] ${
                        activeFilter ? "border-[#0047ff]" : "border-gray-300"
                      }`}
                      onClick={() => setActiveFilter(true)}
                    >
                      <AdjustmentsHorizontalIcon className="size-5" />
                      <span className="text-[15px] font-normal text-gray-500">
                        Filters
                      </span>
                    </button>
                    {activeFilter && (
                      <div
                        className="bg-[#ffff] rounded-xl shadow-popup  w-[400px] overflow-hidden  absolute top-[110%] right-0  border border-gray-200"
                        ref={filterRef}
                      >
                        <div className="flex items-center justify-between border-b-2 border-gray-100 py-2 px-3 bg-[#f9f9f9]">
                          <span className="font-medium">Filter</span>
                          <XMarkIcon
                            className="size-6 hover:cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setActiveFilter(false);
                            }}
                          />
                        </div>
                        <div className="px-3 py-4 flex flex-col gap-5 text-[15px] font-normal">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <label
                                htmlFor=""
                                className="text-[#b2b2bd]"
                              >
                                Select Date
                              </label>
                              <span className="text-[#2754f9] font-medium">
                                Clear
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <label
                                  htmlFor="from"
                                  className="font-medium"
                                >
                                  From:
                                </label>
                                <input
                                  type="date"
                                  name="fromDate"
                                  id="from"
                                  onChange={(e) => setFromDate(e.target.value)}
                                  value={fromDate}
                                  className="border-2 rounded-md px-4 py-[6px] outline-none w-full"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label
                                  htmlFor="to"
                                  className="font-medium"
                                >
                                  To:
                                </label>
                                <input
                                  type="date"
                                  name="toDate"
                                  id="to"
                                  onChange={(e) => setToDate(e.target.value)}
                                  value={toDate}
                                  className="border-2 rounded-md px-4 py-[6px] outline-none w-full"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <label
                                htmlFor="category"
                                className="text-[#b2b2bd]"
                              >
                                Category
                              </label>
                              <span className="text-[#2754f9] font-medium">
                                Clear
                              </span>
                            </div>
                            <select
                              name="category"
                              id="category"
                              className="border-2 rounded-md px-2 py-[6px] outline-none w-full "
                              value={filterByCategory}
                              onChange={(e) =>
                                setFilterByCategory(e.target.value)
                              }
                            >
                              <option value=""></option>
                              <option value="phone">Phone</option>
                              <option value="laptop">Laptop</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <label
                                htmlFor="brand"
                                className="text-[#b2b2bd]"
                              >
                                Brand
                              </label>
                              <span className="text-[#2754f9] font-medium">
                                Clear
                              </span>
                            </div>
                            <select
                              name="brand"
                              id="brand"
                              className="border-2 rounded-md px-4 py-[6px] outline-none w-full"
                              onChange={(e) => setFilterByBrand(e.target.value)}
                              value={filterByBrand}
                            >
                              <option value=""></option>
                              <option value="iphone">iphone</option>
                              <option value="samsung">samsung</option>
                              <option value="vivo">vivo</option>
                              <option value="xiaomi">xiaomi</option>
                              <option value="oppo">oppo</option>
                              <option value="acer">acer</option>
                              <option value="asus">asus</option>
                              <option value="dell">dell</option>
                              <option value="lenovo">lenovo</option>
                              <option value="macbook">macbook</option>
                              <option value="hp">hp</option>
                              <option value="msi">msi</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <label
                                htmlFor="price"
                                className="text-[#b2b2bd]"
                              >
                                Price
                              </label>
                              <span className="text-[#2754f9] font-medium">
                                Clear
                              </span>
                            </div>
                            <select
                              name="price"
                              id="price"
                              className="border-2 rounded-md px-4 py-[6px] outline-none w-full"
                              onChange={(e) => setFilterByPrice(e.target.value)}
                              value={filterByPrice}
                            >
                              <option value=""></option>
                              <option value="0-50">$0 - $50</option>
                              <option value="50-100">$50 - $100</option>
                              <option value="100-200">$100 - $200</option>
                              <option value="200-500">$200 - $500</option>
                              <option value="500-1000">$500 - $1000</option>
                              <option value="1000-1500">$1000 - $1500</option>
                              <option value="1500-2000">$1500 - $2000</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <label
                                htmlFor=""
                                className="text-[#b2b2bd]"
                              >
                                Sales
                              </label>
                              <span className="text-[#2754f9] font-medium">
                                Clear
                              </span>
                            </div>
                            <div className="flex items-center  gap-4 w-full">
                              <label htmlFor="sales">Sales</label>
                              <input
                                type="radio"
                                name="sales"
                                id="sales"
                                className="size-4"
                                onChange={() => setFilterBySales(true)}
                              />
                              <label htmlFor="notSales">No Sales</label>
                              <input
                                type="radio"
                                name="sales"
                                id="notSales"
                                className="size-4"
                                onChange={() => setFilterBySales(false)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 justify-between border-t-2 border-gray-100 px-3 py-6 font-normal">
                          <button
                            onClick={(e) => {
                              handleResetFilter(e);
                            }}
                            className="py-[6px] px-4 border-2 border-gray-300 rounded-md"
                          >
                            Reset
                          </button>
                          <button
                            onClick={(e) => applyFilter(e)}
                            className="bg-[#0047ff] border-2 border-[#0047ff] rounded-md px-5 py-[6px] text-[15px]  text-white"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <table
              className="w-full"
              style={{ padding: "20px" }}
            >
              <thead className="text-[#667085]">
                <tr className="text-[15px] font-medium">
                  <td className="px-5 py-3 rounded-tl-lg rounded-bl-lg">
                    Image
                  </td>
                  <td className="px-5 py-3">Product ID</td>
                  <td className="px-5 py-3">Product Name</td>
                  <td className="px-5 py-3">Category</td>
                  <td className="px-5 py-3">Brand</td>
                  <td className="px-5 py-3">Sales</td>
                  <td className="px-5 py-3">Date</td>
                  <td className="px-5 py-3">Buying Price</td>
                  <td className="px-5 py-3 rounded-tr-lg rounded-br-lg">
                    Actions
                  </td>
                </tr>
              </thead>
              <tbody>
                {allProducts
                  ? allProducts
                      .sort(
                        (a, b) =>
                          new Date(
                            b.createdAt
                              ? b.createdAt
                                  .split(" ")[0]
                                  .split("/")
                                  .reverse()
                                  .join("-")
                              : ""
                          ) -
                          new Date(
                            a.createdAt
                              ? a.createdAt
                                  .split(" ")[0]
                                  .split("/")
                                  .reverse()
                                  .join("-")
                              : ""
                          )
                      )
                      .map((product) => {
                        return (
                          <tr
                            className="text-[14px] border-b-2 border-[#f5f5f5] font-medium"
                            key={product.id}
                          >
                            <td className="px-5 py-5">
                              {product.cate === "laptop"
                                ? product.img.map((img, index) => {
                                    return (
                                      <div
                                        className={`${
                                          index + 1 > 1 ? "hidden" : "block"
                                        } `}
                                        key={index}
                                      >
                                        <LazyLoadImage
                                          src={img}
                                          alt=""
                                          effect="blur"
                                          className={` size-[40px] object-contain`}
                                        />
                                      </div>
                                    );
                                  })
                                : ""}
                              {product.cate === "phone" ? (
                                <img
                                  src={product.img}
                                  alt=""
                                  className="size-[40px] object-contain"
                                />
                              ) : (
                                ""
                              )}
                            </td>
                            <td className="px-5 py-5">{product.id}</td>
                            <td className="px-5 py-5">{product.name}</td>
                            <td className="px-5 py-5">{product.cate}</td>
                            <td className="px-5 py-5">{product.brand}</td>
                            <td className="px-5 py-5 text-red-500">
                              {product.sales}
                            </td>
                            <td className="px-5 py-5 text-gray-500">
                              {product.createdAt
                                ? product.createdAt.split(" ")[0]
                                : ""}
                            </td>
                            <td className="px-5 py-5">${product.newPrice}</td>
                            <td className="px-5 py-5 flex items-center gap-3">
                              <PencilSquareIcon
                                className="size-[20px] text-blue-500 hover:cursor-pointer"
                                onClick={() => {
                                  setIsEdit(true);
                                  setProductEdit(product);
                                }}
                              />
                              <TrashIcon
                                className="size-[20px] text-red-500 hover:cursor-pointer"
                                onClick={() => {
                                  setIsDelete(true);
                                  setProductWantDelete(product);
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })
                  : "Customers is empty"}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default ProductsList;
