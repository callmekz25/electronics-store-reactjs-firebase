import SideBar from "../components/SideBar";
import { useContext, useEffect, useState } from "react";
import {
  deleteObject,
  listAll,
  ref as sRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
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
  const [category, setCategory] = useState("");
  const [sales, setSales] = useState("");
  const [isSale, setIsSale] = useState("");
  const [color1, setColor1] = useState(null);
  const [color2, setColor2] = useState(null);
  const [color3, setColor3] = useState(null);
  const [color4, setColor4] = useState(null);
  const [color5, setColor5] = useState(null);
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

  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [productWantDelete, setProductWantDelete] = useState(null);
  const [productEdit, setProductEdit] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [imgPreview, setImgPreview] = useState([]);
  const { user, loading } = useContext(UserContext);
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
          <div className=" w-[500px] h-[300px] bg-white rounded-lg p-7 flex flex-col justify-between">
            <div className="">
              <h3 className="text-[25px] font-medium text-red-500">
                Are you sure want to cancel order?
              </h3>
              <p className="text-[17px] text-gray-400 font-normal mt-5">
                If you confirm this action cannot be undone and your orders will
                be cancel.
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <button
                className="px-4 py-2 bg-red-500 rounded flex items-center justify-center text-white font-medium text-[15px] outline-none"
                onClick={() => {
                  setIsDelete(false);
                  handleDeleteProduct(productWantDelete.id);
                }}
              >
                Yes, cancel
              </button>
              <button
                className="px-8 py-2 bg-[#e0e0e3] rounded flex items-center justify-center text-gray-400 font-medium text-[15px] outline-none"
                onClick={() => {
                  setIsDelete(false);
                  setProductWantDelete(null);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit product popup*/}
      {isEdit && (
        <div className="overlay">
          <div className=" bg-white rounded-lg p-7 h-[500px] overflow-auto">
            <h3 className="text-[25px] font-medium text-red-500">
              Edit Product
            </h3>
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
                <div className="h-[250px] w-[400px] border-2 border-gray-300 p-5 rounded">
                  <div className="flex items-center gap-4">
                    {imgPreview &&
                      Array.from(imgPreview).map((img) => {
                        return (
                          <div className="size-[80px] flex items-center bg-[#f5f5f5] justify-center p-3 rounded-md">
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
                  <div className="flex flex-col gap-2">
                    <label htmlFor="pName">Name</label>
                    <input
                      type="text"
                      id="pName"
                      className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
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
                      <option value="QXGA+">QXGA+</option>
                      <option value="Full HD+">Full HD+</option>
                      <option value="1.5K">1.5K</option>
                      <option value="1.5K+">1.5K+</option>
                      <option value="2K+">2K+</option>
                      <option value="Retina">Retina(iPhone)</option>
                      <option value="Super Retina XDR">Super Retina XDR</option>
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
                      <option value="128">128GB</option>
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
            <div className="flex items-center justify-end gap-4">
              <button
                className="px-4 py-2 bg-red-500 rounded flex items-center justify-center text-white font-medium text-[15px] outline-none"
                onClick={() => {
                  setIsEdit(false);
                  handleUpdateProduct(productEdit);
                }}
              >
                Update
              </button>
              <button
                className="px-8 py-2 bg-[#e0e0e3] rounded flex items-center justify-center text-gray-400 font-medium text-[15px] outline-none"
                onClick={() => {
                  setIsEdit(false);
                  setProductEdit(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <SideBar isActive={"products"} />
      <div className={`bg-[#ffffff]   px-3 py-5 col-span-5`}>
        <h2 className="text-[25px] font-semibold">Products</h2>
        <div className=" py-[50px]">
          <div className="bg-[#ffffff] rounded-xl py-5 px-3 w-full">
            <table
              className="w-full"
              style={{ padding: "20px" }}
            >
              <thead className="bg-[#f5f5f5]">
                <tr className="text-[15px] font-semibold">
                  <td className="px-5 py-3 rounded-tl-lg rounded-bl-lg">
                    Image
                  </td>
                  <td className="px-5 py-3">ID</td>
                  <td className="px-5 py-3">Product Name</td>
                  <td className="px-5 py-3">Category</td>
                  <td className="px-5 py-3">Brand</td>
                  <td className="px-5 py-3">Sales</td>
                  <td className="px-5 py-3">Old Price</td>
                  <td className="px-5 py-3">New Price</td>
                  <td className="px-5 py-3 rounded-tr-lg rounded-br-lg">
                    Actions
                  </td>
                </tr>
              </thead>
              <tbody>
                {allProducts
                  ? allProducts.map((product) => {
                      if (product.cate === "phone") {
                        return (
                          <tr className="text-[14px] border-b-2 border-[#f5f5f5] font-medium">
                            <td className="px-5 py-5">
                              {product.cate === "laptop"
                                ? product.img.map((img, index) => {
                                    return (
                                      <LazyLoadImage
                                        src={img}
                                        alt=""
                                        effect="blur"
                                        className={`${
                                          index + 1 > 1 ? "hidden" : "block"
                                        } size-[40px] object-contain`}
                                      />
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
                              {product.oldPrice ? `$${product.oldPrice}` : null}
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
                      }
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
