import { useState, useEffect } from "react";
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

import { v4 as uuid } from "uuid";
import { uploadBytes } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import SideBar from "../components/SideBar";

const Admin = () => {
  // State thông tin upload product
  const [name, setName] = useState("");
  const [imgPreview, setImgPreview] = useState([]);
  const [brand, setBrand] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sales, setSales] = useState("");
  const [isSale, setIsSale] = useState("");
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
      console.log(files[i]);
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
          newPrice: newPrice,
          sales: sales,
          isSale: isSale,
          createdAt: currentDay,
          infomation: info,
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

  return (
    <div className="grid grid-cols-6">
      <SideBar isActive={"home"} />
      <div className={`bg-[#f0f1f3] px-[50px] py-5 col-span-5`}>
        <span className="font-semibold text-[25px]">Add new product</span>
        <div className=" py-[50px] grid grid-cols-3 gap-[50px] text-[15px]">
          <div className="flex flex-col gap-2 col-span-3">
            <input
              type="file"
              multiple="multiple"
              className="font-medium"
              onChange={(e) => handlePreviewImg(e)}
            />
            <div className="max-w-[400px] border-2 border-gray-300 p-3 rounded flex items-center">
              <div className="flex items-center gap-3  flex-wrap">
                {imgPreview &&
                  Array.from(imgPreview).map((img) => {
                    return (
                      <div className="size-[70px] flex border-2 border-gray-300 items-center  justify-center p-2 rounded-md">
                        <img
                          src={img.preview}
                          alt="img-review"
                          className="object-contain"
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
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
                  <label htmlFor="pNewPrice">New Price</label>
                  <input
                    type="number"
                    id="pNewPrice"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={(e) => setNewPrice(e.target.value)}
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
                  <label htmlFor="pNewPrice">New Price</label>
                  <input
                    type="number"
                    id="pNewPrice"
                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                    onChange={(e) => setNewPrice(e.target.value)}
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
        </div>
        <button
          className="bg-blue-500 rounded px-5 py-2 text-white font-medium"
          onClick={handlePost}
        >
          Submit
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};
export default Admin;
