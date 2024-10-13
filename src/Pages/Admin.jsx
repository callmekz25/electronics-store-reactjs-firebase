import React, { useState, useEffect } from "react";
// Firebase
import { db } from "../firebase";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref as sRef,
} from "firebase/storage";
import JoditEditor from "jodit-react";
import { v4 as uuid } from "uuid";
import { uploadBytes } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import SideBar from "../components/SideBar";
import {
  PhotoIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

const Admin = () => {
  // State thông tin upload product
  const [name, setName] = useState("");
  const [imgPreview, setImgPreview] = useState([]);
  const [brand, setBrand] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isSale, setIsSale] = useState("");
  const [description, setDescription] = useState("");
  const [color1, setColor1] = useState(null);
  const [color2, setColor2] = useState(null);
  const [color3, setColor3] = useState(null);
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

  // Xử lí lấy ảnh từ input và preview ra`
  const handlePreviewImg = (e) => {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
    }
    setImgPreview(files);
  };

  // Hàm remove url preview để tránh bị rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      for (let i = 0; i < imgPreview.length; i++) {
        URL.revokeObjectURL(imgPreview[i].preview);
      }
    };
  }, [imgPreview]);
  // Hàm xử lí post laptop
  const handlePost = async () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const currentDay = `${day}/${month}/${year}`;
    const id = uuid();
    if (imgPreview.length === 0) {
      console.log("Image null!");
    } else {
      // Lưu ảnh vào storage firebase
      const urls = [];
      for (let i = 0; i < imgPreview.length; i++) {
        const imageRef = sRef(
          storage,
          `images/image ${id}/${imgPreview[i].name + uuid()}`
        );
        await uploadBytes(imageRef, imgPreview[i]).then(() => {
          console.log("Up success!");
        });
        const url = await getDownloadURL(imageRef);
        urls.push(url);
      }
      let info = {};
      if (urls.length > 0) {
        if (category === "laptop") {
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
        } else if (category === "phone") {
          info = {
            behindCamera: infomationPhone.behindCamera,
            frontCamera: infomationPhone.frontCamera,
            resolution: infomationPhone.resolution,
            inch: infomationPhone.inch,
            connector: infomationPhone.connector,
            ram: infomationPhone.ram,
            hardDrive: infomationPhone.hardDrive,
            cpu: infomationPhone.cpu,
            pin: infomationPhone.pin,
            hz: infomationPhone.hz,
            weight: infomationPhone.weight,
          };
        }
        const dataRef = doc(db, "All-products", id);

        const product = {
          id: id,
          name: name,
          brand: brand,
          img: urls,
          cate: category,
          colors: [color1, color2, color3],
          oldPrice: oldPrice,
          isSale: isSale,
          createdAt: currentDay,
          infomation: info,
          description: description,
        };
        await setDoc(dataRef, product);
      } else {
        toast.error("Image is null", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    }
  };
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
  console.log(brand);

  return (
    <div className="grid grid-cols-6">
      <SideBar isActive={"home"} />
      <div className={`bg-[#f8f8f8] px-[20px] py-5 col-span-5`}>
        <span className="font-semibold text-[22px]">Create a New product</span>
        <div className="grid grid-cols-6 gap-2 mt-5">
          {/* Upload file */}
          <div className=" col-span-2 bg-[#ffff] border-2 border-gray-200 rounded-md h-fit">
            <div className="py-2 px-4">
              <span className="text-[16px] font-semibold">Product Images</span>
            </div>
            <div className="flex flex-col gap-2 border-t-2 border-gray-200 py-2 pl-2">
              <input
                type="file"
                multiple="multiple"
                className="font-medium hidden"
                id="files"
                onChange={(e) => handlePreviewImg(e)}
              />
              <div className="flex items-center py-5 px-3 overflow-hidden gap-2">
                <div className="flex items-center justify-center py-6 px-6 border-2 border-gray-200 border-dashed rounded max-w-[160px] min-w-[160px]">
                  <div className="flex flex-col justify-center items-center">
                    <PhotoIcon className="size-7 text-gray-400" />
                    <span className="text-center text-gray-400 text-[11px] mt-4">
                      Select your image here
                      <label
                        htmlFor="files"
                        className="text-blue-500 underline hover:cursor-pointer"
                      >
                        {" "}
                        Click to browse
                      </label>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {imgPreview &&
                    Array.from(imgPreview).map((img) => {
                      return (
                        <div className=" flex border-2 border-gray-200 bg-[#f8f8f8] items-center justify-center rounded-md min-w-[160px] min-h-[150px]">
                          <img
                            src={img.preview}
                            alt="img-review"
                            className="object-contain size-[120px]"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
          {/* Product */}
          <div className=" col-span-4">
            <div className="flex flex-col gap-2">
              {/* Product Type */}
              <div className=" bg-[#ffff] border-2 border-gray-200 rounded-md">
                <div className="py-2 px-4">
                  <span className="text-[16x] font-semibold">Product Type</span>
                </div>
                <div
                  className={`border-t-2 border-gray-200 py-5 px-3 grid grid-cols-4 gap-2 `}
                >
                  <div
                    className={`border-2  bg-[#f8f8f8] rounded-md p-3 hover:cursor-pointer ${
                      category === "phone"
                        ? "border-[#4e5de8] bg-gradient-to-b from-[#f2f3fd] to-[#f9fafe]"
                        : "border-gray-200"
                    }`}
                    onClick={() => setCategory("phone")}
                  >
                    <div className="flex items-center justify-center w-fit p-2 bg-[#ffff] rounded border-2 border-gray-100">
                      <DevicePhoneMobileIcon
                        className={`size-7  ${
                          category === "phone"
                            ? "text-[#4e5de8]"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="mt-5">
                      <span className="text-[13px] font-medium">
                        Mobile Phone
                      </span>
                    </div>
                  </div>
                  <div
                    className={`border-2  bg-[#f8f8f8] rounded-md p-3 hover:cursor-pointer ${
                      category === "laptop"
                        ? "border-[#4e5de8] bg-gradient-to-b from-[#f2f3fd] to-[#f9fafe]"
                        : "border-gray-200"
                    }`}
                    onClick={() => setCategory("laptop")}
                  >
                    <div className="flex items-center justify-center w-fit p-2 bg-[#ffff] rounded border-2 border-gray-100">
                      <ComputerDesktopIcon
                        className={`size-7  ${
                          category === "laptop"
                            ? "text-[#4e5de8]"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="mt-5">
                      <span className="text-[13px] font-medium">Laptop</span>
                    </div>
                  </div>
                  <div
                    className={`border-2  bg-[#f8f8f8] rounded-md p-3 hover:cursor-pointer ${
                      category === "smartwatch"
                        ? "border-[#4e5de8] bg-gradient-to-b from-[#f2f3fd] to-[#f9fafe]"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-center w-fit p-2 bg-[#ffff] rounded border-2 border-gray-100">
                      <ion-icon
                        name="watch-outline"
                        class={`text-[28px]  ${
                          category === "smartwatch"
                            ? "text-[#4e5de8]"
                            : "text-gray-500"
                        }`}
                      ></ion-icon>
                    </div>
                    <div className="mt-5">
                      <span className="text-[13px] font-medium">
                        Smartwatches
                      </span>
                    </div>
                  </div>
                  <div
                    className={`border-2  bg-[#f8f8f8] rounded-md p-3 hover:cursor-pointer ${
                      category === "headphone"
                        ? "border-[#4e5de8] bg-gradient-to-b from-[#f2f3fd] to-[#f9fafe]"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-center w-fit p-2 bg-[#ffff] rounded border-2 border-gray-100">
                      <ion-icon
                        name="headset-outline"
                        class={`text-[28px]  ${
                          category === "headphone"
                            ? "text-[#4e5de8]"
                            : "text-gray-500"
                        }`}
                      ></ion-icon>
                    </div>
                    <div className="mt-5">
                      <span className="text-[13px] font-medium">Headphone</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Product Detail */}
              <div className="bg-[#ffff] border-2 border-gray-200 rounded-md">
                <div className="py-2 px-4">
                  <span className="text-[16px] font-semibold">
                    Product Detail
                  </span>
                </div>
                {category === "phone" && (
                  <div className="py-5 px-3 grid grid-cols-6 gap-x-3 gap-y-5 border-t-2 border-gray-200">
                    <div className="flex flex-col gap-2 col-span-3">
                      <label
                        htmlFor="pname"
                        className="font-medium text-[14px]"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="pname"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        placeholder="Enter the name of product"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-span-3">
                      <label
                        htmlFor="brand"
                        className="font-medium text-[14px]"
                      >
                        Brand
                      </label>
                      <select
                        name="brand"
                        id="brand"
                        onChange={(e) => setBrand(e.target.value)}
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      >
                        <option value=""></option>
                        <option value="iphone">iPhone</option>
                        <option value="samsung">Samsung</option>
                        <option value="xiaomi">Xiaomi</option>
                        <option value="oppo">Oppo</option>
                        <option value="vivo">Vivo</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-span-3">
                      <label
                        htmlFor="price"
                        className="font-medium text-[14px]"
                      >
                        Price
                      </label>
                      <input
                        name="oldPrice"
                        id="price"
                        type="number"
                        onChange={(e) => setOldPrice(e.target.value)}
                        placeholder="Enter the price of product"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      />
                    </div>

                    <div className="flex flex-col gap-2 col-span-3">
                      <label
                        htmlFor="discount"
                        className="font-medium text-[14px]"
                      >
                        Discount Status
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          name="isSale"
                          id="notSale"
                          type="radio"
                          onChange={() => setIsSale(false)}
                          className="size-4"
                        />
                        <label
                          htmlFor="notSale"
                          className="font-medium text-[14px]"
                        >
                          Not sales
                        </label>
                        <input
                          name="isSale"
                          id="isSale"
                          type="radio"
                          onChange={() => setIsSale(true)}
                          className="size-4"
                        />
                        <label
                          htmlFor="isSale"
                          className="font-medium text-[14px]"
                        >
                          Sales
                        </label>
                      </div>
                    </div>
                    {/* Row 3 */}
                    <div className="flex flex-col gap-2 col-start-1 col-end-3">
                      <label
                        htmlFor="fc"
                        className="font-medium text-[14px]"
                      >
                        Front Camera
                      </label>
                      <input
                        name="frontCamera"
                        id="fb"
                        type="text"
                        onChange={handleInfomationPhone}
                        value={infomationPhone.frontCamera}
                        placeholder="Enter the front camera"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-start-3 col-end-5">
                      <label
                        htmlFor="bc"
                        className="font-medium text-[14px]"
                      >
                        Behind Camera
                      </label>
                      <input
                        name="behindCamera"
                        id="bc"
                        type="text"
                        onChange={handleInfomationPhone}
                        value={infomationPhone.behindCamera}
                        placeholder="Enter the behind camera"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-start-5 col-end-7">
                      <label
                        htmlFor="sales"
                        className="font-medium text-[14px]"
                      >
                        Colors
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="outline-none border-2 border-gray-200 rounded-md size-10"
                          onChange={(e) => setColor1(e.target.value)}
                        />
                        <input
                          type="color"
                          className="outline-none border-2 border-gray-200 rounded-md size-10"
                          onChange={(e) => setColor2(e.target.value)}
                        />
                        <input
                          type="color"
                          className="outline-none border-2 border-gray-200 rounded-md size-10"
                          onChange={(e) => setColor3(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* Row 4 */}
                    <div className="flex flex-col gap-2 col-start-1 col-end-3">
                      <label
                        htmlFor="pres"
                        className="font-medium text-[14px]"
                      >
                        Resolution
                      </label>
                      <select
                        name="resolution"
                        id="pres"
                        onChange={handleInfomationPhone}
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      >
                        <option value=""></option>
                        <option value="QQVGA">QQVGA</option>
                        <option value="QVGA">QVGA</option>
                        <option value="Full HD+">Full HD+</option>
                        <option value="1.5K">1.5K</option>
                        <option value="1.5K+">1.5K+</option>
                        <option value="2K+">2K+</option>
                        <option value="Retina">Retina(iPhone)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-start-3 col-end-5">
                      <label
                        htmlFor="pinch"
                        className="font-medium text-[14px]"
                      >
                        Screen Size
                      </label>
                      <input
                        type="text"
                        name="inch"
                        id="pinch"
                        placeholder="Enter the size"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        onChange={handleInfomationPhone}
                        value={infomationPhone.inch}
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-start-5 col-end-7">
                      <label
                        htmlFor="pram"
                        className="font-medium text-[14px]"
                      >
                        RAM (Random Access Memory)
                      </label>
                      <select
                        name="ram"
                        id="pram"
                        onChange={handleInfomationPhone}
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      >
                        <option value=""></option>
                        <option value="3">3GB</option>
                        <option value="4">4GB</option>
                        <option value="6">6GB</option>
                        <option value="8">8GB</option>
                        <option value="16">12GB</option>
                      </select>
                    </div>
                    {/* Row 5 */}
                    <div className="flex flex-col gap-2 col-start-1 col-end-3">
                      <label
                        htmlFor="phz"
                        className="font-medium text-[14px]"
                      >
                        Hz
                      </label>
                      <select
                        name="hz"
                        id="phz"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        onChange={handleInfomationPhone}
                      >
                        <option value=""></option>
                        <option value="60">60Hz</option>
                        <option value="90">90Hz</option>
                        <option value="120">120Hz</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-start-3 col-end-5">
                      <label
                        htmlFor="phd"
                        className="font-medium text-[14px]"
                      >
                        Storage Capacity
                      </label>
                      <select
                        name="hardDrive"
                        id="phd"
                        onChange={handleInfomationPhone}
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      >
                        <option value=""></option>
                        <option value="64">64GB</option>
                        <option value="256">256GB</option>
                        <option value="512">512GB</option>
                        <option value="1">1TB</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-start-5 col-end-7">
                      <label
                        htmlFor="pcpu"
                        className="font-medium text-[14px]"
                      >
                        Processor
                      </label>
                      <input
                        type="text"
                        id="pcpu"
                        name="cpu"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        placeholder="Enther the processor (cpu)"
                        value={infomationPhone.cpu}
                        onChange={handleInfomationPhone}
                      />
                    </div>
                    {/* Row 6 */}
                    <div className="flex flex-col gap-2 col-start-1 col-end-3">
                      <label
                        htmlFor="lconnector "
                        className="font-medium text-[14px]"
                      >
                        Connector
                      </label>
                      <input
                        type="text"
                        id="lconnector"
                        name="connector"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        placeholder="Enter the connector"
                        value={infomationPhone.connector}
                        onChange={handleInfomationPhone}
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-start-3 col-end-5">
                      <label
                        htmlFor="ppin"
                        className="font-medium text-[14px]"
                      >
                        Battery
                      </label>
                      <input
                        type="text"
                        id="ppin"
                        name="pin"
                        placeholder="Enter the battery"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        value={infomationPhone.pin}
                        onChange={handleInfomationPhone}
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-start-5 col-end-7">
                      <label
                        htmlFor="pweight"
                        className="font-medium text-[14px]"
                      >
                        Weight
                      </label>
                      <input
                        type="number"
                        id="pweight"
                        name="weight"
                        placeholder="Enter the weight"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        value={infomationPhone.weight}
                        onChange={handleInfomationPhone}
                      />
                    </div>
                  </div>
                )}
                {category === "laptop" && (
                  <div className="py-5 px-3 grid grid-cols-6 gap-x-3 gap-y-5 border-t-2 border-gray-200">
                    <div className="flex flex-col gap-2 col-span-3">
                      <label
                        htmlFor="pname"
                        className="font-medium text-[14px]"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="pname"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        placeholder="Enter the name of product"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-span-3">
                      <label
                        htmlFor="brand"
                        className="font-medium text-[14px]"
                      >
                        Brand
                      </label>
                      <select
                        name="brand"
                        id="brand"
                        onChange={(e) => setBrand(e.target.value)}
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      >
                        <option value=""></option>
                        <option value="Dell">Dell</option>
                        <option value="Hp">Hp</option>
                        <option value="Asus">Asus</option>
                        <option value="Acer">Acer</option>
                        <option value="Macbook">Macbook</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Msi">Msi</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-span-3">
                      <label
                        htmlFor="price"
                        className="font-medium text-[14px]"
                      >
                        Price
                      </label>
                      <input
                        name="oldPrice"
                        id="price"
                        type="number"
                        onChange={(e) => setOldPrice(e.target.value)}
                        placeholder="Enter the price of product"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      />
                    </div>

                    <div className="flex flex-col gap-2 col-span-3">
                      <label
                        htmlFor="discount"
                        className="font-medium text-[14px]"
                      >
                        Discount Status
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          name="isSale"
                          id="notSale"
                          type="radio"
                          onChange={() => setIsSale(false)}
                          className="size-4"
                        />
                        <label
                          htmlFor="notSale"
                          className="font-medium text-[14px]"
                        >
                          Not sales
                        </label>
                        <input
                          name="isSale"
                          id="isSale"
                          type="radio"
                          onChange={() => setIsSale(true)}
                          className="size-4"
                        />
                        <label
                          htmlFor="isSale"
                          className="font-medium text-[14px]"
                        >
                          Sales
                        </label>
                      </div>
                    </div>
                    {/* Row 3 */}
                    <div className="flex flex-col gap-2 col-start-1 col-end-3">
                      <label
                        htmlFor="ptype"
                        className=" font-medium text-[14px]"
                      >
                        Type of Laptop
                      </label>
                      <select
                        name="type"
                        id="ptype"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        onChange={handleInfomation}
                      >
                        <option value=""></option>
                        <option value="Thin Light">Thin Light</option>
                        <option value="Office Learn">Office Learn</option>
                        <option value="Gaming">Gaming</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-start-3 col-end-5">
                      <label
                        htmlFor="pcard"
                        className="text-[14px] font-medium"
                      >
                        Graphics Card
                      </label>
                      <input
                        type="text"
                        id="pcard"
                        name="card"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        value={infomation.card}
                        onChange={handleInfomation}
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-start-5 col-end-7">
                      <label
                        htmlFor="sales"
                        className="font-medium text-[14px]"
                      >
                        Colors
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="outline-none border-2 border-gray-200 rounded-md size-10"
                          onChange={(e) => setColor1(e.target.value)}
                        />
                        <input
                          type="color"
                          className="outline-none border-2 border-gray-200 rounded-md size-10"
                          onChange={(e) => setColor2(e.target.value)}
                        />
                        <input
                          type="color"
                          className="outline-none border-2 border-gray-200 rounded-md size-10"
                          onChange={(e) => setColor3(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* Row 4 */}
                    <div className="flex flex-col gap-2 col-start-1 col-end-3">
                      <label
                        htmlFor="pres"
                        className="font-medium text-[14px]"
                      >
                        Resolution
                      </label>
                      <select
                        name="resolution"
                        id="pres"
                        onChange={handleInfomation}
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      >
                        <option value=""></option>
                        <option value="Full HD">Full HD</option>
                        <option value="2K">2K</option>
                        <option value="2.8K">2.8K</option>
                        <option value="4K">4K</option>
                        <option value="Retina">Retina</option>
                        <option value="Liquid Retina">Liquid Retina</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-start-3 col-end-5">
                      <label
                        htmlFor="linch"
                        className="font-medium text-[14px]"
                      >
                        Screen Size
                      </label>
                      <select
                        name="inch"
                        id="linch"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        onChange={handleInfomation}
                      >
                        <option value=""></option>
                        <option value="11.6">11.6</option>
                        <option value="13.3">13.3</option>
                        <option value="13.4">13.4</option>
                        <option value="13.6">13.6</option>
                        <option value="14">14</option>
                        <option value="14.2">14.2</option>
                        <option value="16">16</option>
                        <option value="16.2">16.2</option>
                        <option value="17">17</option>
                        <option value="17.3">17.3</option>
                        <option value="18">18</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-start-5 col-end-7">
                      <label
                        htmlFor="pram"
                        className="font-medium text-[14px]"
                      >
                        RAM (Random Access Memory)
                      </label>
                      <select
                        name="ram"
                        id="pram"
                        onChange={handleInfomation}
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      >
                        <option value=""></option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                        <option value="32">32</option>
                        <option value="36">36</option>
                        <option value="64">64</option>
                      </select>
                    </div>
                    {/* Row 5 */}
                    <div className="flex flex-col gap-2 col-start-1 col-end-3">
                      <label
                        htmlFor="lhz"
                        className="font-medium text-[14px]"
                      >
                        Hz
                      </label>
                      <select
                        name="hz"
                        id="lhz"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        onChange={handleInfomation}
                      >
                        <option value=""></option>
                        <option value="60">60</option>
                        <option value="90">90</option>
                        <option value="120">120</option>
                        <option value="144">144</option>
                        <option value="165">165</option>
                        <option value="240">240</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-start-3 col-end-5">
                      <label
                        htmlFor="lhd"
                        className="font-medium text-[14px]"
                      >
                        Storage Capacity
                      </label>
                      <select
                        name="hardDrive"
                        id="lhd"
                        onChange={handleInfomation}
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      >
                        <option value=""></option>
                        <option value="256">256</option>
                        <option value="512">512</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 col-start-5 col-end-7">
                      <label
                        htmlFor="lcpu"
                        className="font-medium text-[14px]"
                      >
                        Processor
                      </label>
                      <select
                        name="cpu"
                        id="lcpu"
                        onChange={handleInfomation}
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                      >
                        <option value=""></option>
                        <option value="Core i3">Core i3</option>
                        <option value="Core i5">Core i5</option>
                        <option value="Core i7">Core i7</option>
                        <option value="Core i9">Core i9</option>
                        <option value="Ultra 5">Ultra 5</option>
                        <option value="Ultra 7">Ultra 7</option>
                        <option value="Ultra 9">Ultra 9</option>
                        <option value="Ryzen 5">Ryzen 5</option>
                        <option value="Ryzen 7">Ryzen 7</option>
                        <option value="Ryzen 9">Ryzen 9</option>
                        <option value="Apple M1">Apple M1</option>
                        <option value="Apple M2">Apple M2</option>
                        <option value="Apple M3">Apple M3</option>
                        <option value="Apple M3 Pro">Apple M3 Pro</option>
                        <option value="Apple M3 Pro Max">
                          Apple M3 Pro Max
                        </option>
                      </select>
                    </div>
                    {/* Row 6 */}
                    <div className="flex flex-col gap-2 col-start-1 col-end-3">
                      <label
                        htmlFor="lconnector "
                        className="font-medium text-[14px]"
                      >
                        Connector
                      </label>
                      <input
                        type="text"
                        id="lconnector"
                        name="connector"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        placeholder="Enter the connector"
                        value={infomation.connector}
                        onChange={handleInfomation}
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-start-3 col-end-5">
                      <label
                        htmlFor="lpin"
                        className="font-medium text-[14px]"
                      >
                        Battery
                      </label>
                      <input
                        type="text"
                        id="lpin"
                        name="pin"
                        placeholder="Enter the battery"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        value={infomation.pin}
                        onChange={handleInfomation}
                      />
                    </div>
                    <div className="flex flex-col gap-2 col-start-5 col-end-7">
                      <label
                        htmlFor="lweight"
                        className="font-medium text-[14px]"
                      >
                        Weight
                      </label>
                      <input
                        type="number"
                        id="lweight"
                        name="weight"
                        placeholder="Enter the weight"
                        className="outline-none border text-[14px] placeholder:font-light border-gray-200 rounded-md px-3 py-[6px]"
                        value={infomation.weight}
                        onChange={handleInfomation}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* Product Description */}
              <div className="bg-[#ffff] border-2 border-gray-200 rounded-md">
                <div className="py-2 px-4">
                  <span className="text-[16px] font-semibold">
                    Product Description
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 py-5 px-3">
                  <JoditEditor
                    value={description}
                    onChange={setDescription}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Product Detail Old*/}
        {/* <div className=" py-[50px] grid grid-cols-3 gap-[50px] text-[15px]">
          <div className="grid grid-cols-2 gap-10 font-medium">
            <div className="flex flex-col gap-2">
              <label htmlFor="pname">Name</label>
              <input
                type="text"
                id="pname"
                className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="pcate">Category</label>
              <select
                name="pcate"
                id="pcate"
                className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=""></option>
                <option value="phone">Phone</option>
                <option value="laptop">Laptop</option>
              </select>
            </div>
            {category === "laptop" && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pbrand">Brand</label>
                  <input
                    type="text"
                    id="pbrand"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={(e) => setBrand(e.target.value)}
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
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pOldPrice">Old Price</label>
                  <input
                    type="number"
                    id="pOldPrice"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={(e) => setOldPrice(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="psales">Sales</label>
                  <input
                    type="text"
                    id="psales"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={(e) => setSales(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
                  <label htmlFor="ptype">Type</label>
                  <select
                    name="type"
                    id="ptype"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={handleInfomation}
                  >
                    <option value=""></option>
                    <option value="Thin Light">Thin Light</option>
                    <option value="Office Learn">Office Learn</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lres">Resolution</label>
                  <select
                    name="resolution"
                    id="lres"
                    onChange={handleInfomation}
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value=""></option>
                    <option value="Full HD">Full HD</option>
                    <option value="2K">2K</option>
                    <option value="2.8K">2.8K</option>
                    <option value="4K">4K</option>
                    <option value="Retina">Retina</option>
                    <option value="Liquid Retina">Liquid Retina</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="linch">Inch</label>
                  <select
                    name="inch"
                    id="linch"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={handleInfomation}
                  >
                    <option value=""></option>
                    <option value="11.6">11.6</option>
                    <option value="13.3">13.3</option>
                    <option value="13.4">13.4</option>
                    <option value="13.6">13.6</option>
                    <option value="14">14</option>
                    <option value="14.2">14.2</option>
                    <option value="16">16</option>
                    <option value="16.2">16.2</option>
                    <option value="17">17</option>
                    <option value="17.3">17.3</option>
                    <option value="18">18</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lconnector">Connector</label>
                  <input
                    type="text"
                    id="lconnector"
                    name="connector"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    value={infomation.connector}
                    onChange={handleInfomation}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lram">Ram</label>
                  <select
                    name="ram"
                    id="lram"
                    onChange={handleInfomation}
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value=""></option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="32">32</option>
                    <option value="36">36</option>
                    <option value="64">64</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lhd">Hard Drive</label>
                  <select
                    name="hardDrive"
                    id="lhd"
                    onChange={handleInfomation}
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value=""></option>
                    <option value="256">256</option>
                    <option value="512">512</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pcpu">CPU</label>
                  <input
                    type="text"
                    id="pcpu"
                    name="cpu"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    value={infomation.cpu}
                    onChange={handleInfomation}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="ppin">Pin</label>
                  <input
                    type="text"
                    id="ppin"
                    name="pin"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    value={infomation.pin}
                    onChange={handleInfomation}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lhz">Hz</label>
                  <select
                    name="hz"
                    id="lhz"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={handleInfomation}
                  >
                    <option value=""></option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                    <option value="120">120</option>
                    <option value="144">144</option>
                    <option value="165">165</option>
                    <option value="240">240</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pcard">Card</label>
                  <input
                    type="text"
                    id="pcard"
                    name="card"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    value={infomation.card}
                    onChange={handleInfomation}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="pweight">Weight</label>
                  <input
                    type="number"
                    id="pweight"
                    name="weight"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    value={infomation.weight}
                    onChange={handleInfomation}
                  />
                </div>
              </>
            )}
            {category === "phone" && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pbrand">Brand</label>
                  <input
                    type="text"
                    id="pbrand"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={(e) => setBrand(e.target.value)}
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
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="pOldPrice">Old Price</label>
                  <input
                    type="number"
                    id="pOldPrice"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={(e) => setOldPrice(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="psales">Sales</label>
                  <input
                    type="text"
                    id="psales"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={(e) => setSales(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
                  <label htmlFor="pFc">Front Camera</label>
                  <input
                    type="text"
                    name="frontCamera"
                    id="pFc"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={handleInfomationPhone}
                    value={infomationPhone.frontCamera}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pBc">Behind Camera</label>
                  <input
                    type="text"
                    name="behindCamera"
                    id="pBc"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={handleInfomationPhone}
                    value={infomationPhone.behindCamera}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pres">Resolution</label>
                  <select
                    name="resolution"
                    id="pres"
                    onChange={handleInfomationPhone}
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value=""></option>
                    <option value="QQVGA">QQVGA</option>
                    <option value="QVGA">QVGA</option>
                    <option value="Full HD+">Full HD+</option>
                    <option value="1.5K">1.5K</option>
                    <option value="1.5K+">1.5K+</option>
                    <option value="2K+">2K+</option>
                    <option value="Retina">Retina(iPhone)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pinch">Inch</label>
                  <input
                    type="text"
                    name="inch"
                    id="pinch"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={handleInfomationPhone}
                    value={infomationPhone.inch}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lconnector">Connector</label>
                  <input
                    type="text"
                    id="lconnector"
                    name="connector"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    value={infomationPhone.connector}
                    onChange={handleInfomationPhone}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pram">Ram</label>
                  <select
                    name="ram"
                    id="pram"
                    onChange={handleInfomationPhone}
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value=""></option>
                    <option value="3">3GB</option>
                    <option value="4">4GB</option>
                    <option value="6">6GB</option>
                    <option value="8">8GB</option>
                    <option value="16">12GB</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phd">Hard Drive</label>
                  <select
                    name="hardDrive"
                    id="phd"
                    onChange={handleInfomationPhone}
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value=""></option>
                    <option value="64">64GB</option>
                    <option value="256">256GB</option>
                    <option value="512">512GB</option>
                    <option value="1">1TB</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pcpu">CPU</label>
                  <input
                    type="text"
                    id="pcpu"
                    name="cpu"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    value={infomationPhone.cpu}
                    onChange={handleInfomationPhone}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="ppin">Pin</label>
                  <input
                    type="text"
                    id="ppin"
                    name="pin"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    value={infomationPhone.pin}
                    onChange={handleInfomationPhone}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phz">Hz</label>
                  <select
                    name="hz"
                    id="phz"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={handleInfomationPhone}
                  >
                    <option value=""></option>
                    <option value="60">60Hz</option>
                    <option value="90">90Hz</option>
                    <option value="120">120Hz</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="pweight">Weight</label>
                  <input
                    type="number"
                    id="pweight"
                    name="weight"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    value={infomationPhone.weight}
                    onChange={handleInfomationPhone}
                  />
                </div>
              </>
            )}
          </div>
        </div> */}
        <div className="flex items-cente justify-end mt-5">
          <button
            className="bg-blue-600 rounded px-5 text-[14px] py-[6px] text-white font-medium "
            onClick={handlePost}
          >
            Create
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};
export default Admin;
