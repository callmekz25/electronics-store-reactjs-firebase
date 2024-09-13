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
    const [name, setName] = useState(null);
    const [frontCamera, setFrontCamera] = useState(null);
    const [behindCamera, setBehindCamera] = useState(null);
    const [connector, setConnector] = useState(null);
    const [pin, setPin] = useState(null);
    const [cpu, setCpu] = useState(null);
    const [resolution, setResolution] = useState(null);
    const [weight, setWeight] = useState(null);
    const [inch, setInch] = useState(null);
    const [ram, setRam] = useState(null);
    const [hardDrive, setHardDrive] = useState(null);
    const [hz, setHz] = useState(null);

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
    });
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        if (products) {
            setAllProducts(products);
        }
    }, [products]);

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

    const handleUpdateProduct = async (productId) => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const currentDay = `${day}.${month}.${year}`;
        if (imgPreview.length === 0 && name === null) {
            console.log("Image null!");
        } else {
            // Lấy ra ref của storage lưu folder images
            const imageListRef = sRef(storage, `images/image ${productId}`);
            const listImages = await listAll(imageListRef);
            // Lặp qua và xóa ảnh
            const deleteListImages = listImages.items.map((item) =>
                deleteObject(item)
            );
            // Đợi tất cả ảnh được xóa
            await Promise.all(deleteListImages);
            const urls = [];
            // Update ảnh mới lên folder cũ vừa xóa các ảnh trên
            for (let i = 0; i < imgPreview.length; i++) {
                const imageRef = sRef(
                    storage,
                    `images/image ${productId}/${imgPreview[i].name + uuid()}`
                );
                await uploadBytes(imageRef, imgPreview[i]).then(() => {
                    console.log("Update images success!");
                });
                // Lấy ra url của từng ảnh và đẩy vô 1 mảng để lưu trữ được ảnh theo thứ tự mong muốn
                const url = await getDownloadURL(imageRef);
                urls.push(url);
            }

            if (urls.length > 0 || name) {
                const docRef = doc(db, "All-products", productId);
                const productDataUpdate = {
                    name: name,
                    img: urls,
                    updatedAt: currentDay,
                    infomation: {
                        frontCamera: frontCamera,
                        behindCamera: behindCamera,
                        connector: connector,
                        pin: pin,
                        cpu: cpu,
                        inch: inch,
                        resolution: resolution,
                        weight: weight,
                        ram: ram,
                        hardDrive: hardDrive,
                        hz: hz,
                    },
                };
                await updateDoc(docRef, productDataUpdate);
                if (updateDoc) {
                    toast.success("Update successfully!", {
                        position: "top-center",
                        autoClose: 1500,
                    });
                }
            }
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
                    <div className="popup w-[500px] h-[300px] bg-white rounded-lg p-7 flex flex-col justify-between">
                        <div className="">
                            <h3 className="text-[25px] font-medium text-red-500">
                                Are you sure want to cancel order?
                            </h3>
                            <p className="text-[17px] text-gray-400 font-normal mt-5">
                                If you confirm this action cannot be undone and
                                your orders will be cancel.
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
                    <div className="popup bg-white rounded-lg p-7 h-[500px] overflow-auto">
                        <h3 className="text-[25px] font-medium text-red-500">
                            Edit Product
                        </h3>
                        <div className="flex items-center gap-2 py-2">
                            <span>Product ID:</span>
                            <span>{productEdit.id}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-[30px] py-[30px]">
                            <div className="flex flex-col gap-2 col-span-3">
                                <input
                                    type="file"
                                    multiple="multiple"
                                    onChange={(e) => handlePreviewImg(e)}
                                />
                                <div className="h-[250px] w-[400px] border-2 border-gray-300 p-5 rounded">
                                    <div className="flex items-center gap-4">
                                        {imgPreview &&
                                            Array.from(imgPreview).map(
                                                (img) => {
                                                    return (
                                                        <div className="size-[80px] flex items-center bg-[#f5f5f5] justify-center p-3 rounded-md">
                                                            <img
                                                                src={
                                                                    img.preview
                                                                }
                                                                alt=""
                                                                className=" object-contain"
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pname">Name</label>
                                <input
                                    type="text"
                                    id="pname"
                                    value={name}
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pcate">Front Camera</label>
                                <input
                                    type="text"
                                    id="pcate"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) =>
                                        setFrontCamera(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pbrand">Behind Camera</label>
                                <input
                                    type="text"
                                    id="pbrand"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) =>
                                        setBehindCamera(e.target.value)
                                    }
                                />
                            </div>
                            {/* <div className="flex flex-col gap-2">
                                <label htmlFor="pcolor">Colors</label>
                                <input
                                    type="text"
                                    id="pcolor"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pOldPrice">Old Price</label>
                                <input
                                    type="number"
                                    id="pOldPrice"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pNewPrice">New Price</label>
                                <input
                                    type="number"
                                    id="pNewPrice"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="psales">Sales</label>
                                <input
                                    type="text"
                                    id="psales"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pissale">Is Sale</label>
                                <input
                                    type="text"
                                    id="pissale"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                />
                            </div> */}
                            {/* <div className="flex flex-col gap-2">
                                <label htmlFor="ptype">Type</label>
                                <input
                                    type="text"
                                    id="ptype"
                                    name="type"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                />
                            </div> */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pres">Resolution</label>
                                <input
                                    type="text"
                                    id="pres"
                                    name="resolution"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) =>
                                        setResolution(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pinch">Inch</label>
                                <input
                                    type="number"
                                    id="pinch"
                                    name="inch"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) => setInch(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pconnector">Connector</label>
                                <input
                                    type="text"
                                    id="pconnector"
                                    name="connector"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) =>
                                        setConnector(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pram">Ram</label>
                                <input
                                    type="number"
                                    id="pram"
                                    name="ram"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) => setRam(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="phd">Hard Drive</label>
                                <input
                                    type="number"
                                    id="hpd"
                                    name="hardDrive"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) =>
                                        setHardDrive(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="pcpu">CPU</label>
                                <input
                                    type="text"
                                    id="pcpu"
                                    name="cpu"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) => setCpu(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="ppin">Pin</label>
                                <input
                                    type="text"
                                    id="ppin"
                                    name="pin"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) => setPin(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="phz">Hz</label>
                                <input
                                    type="number"
                                    id="phz"
                                    name="hz"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) => setHz(e.target.value)}
                                />
                            </div>
                            {/* <div className="flex flex-col gap-2">
                                <label htmlFor="pcard">Card</label>
                                <input
                                    type="text"
                                    id="pcard"
                                    name="card"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                />
                            </div> */}

                            <div className="flex flex-col gap-2">
                                <label htmlFor="pweight">Weight</label>
                                <input
                                    type="number"
                                    id="pweight"
                                    name="weight"
                                    className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-red-500 rounded flex items-center justify-center text-white font-medium text-[15px] outline-none"
                                onClick={() => {
                                    setIsEdit(false);
                                    handleUpdateProduct(productEdit.id);
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
                                                          {product.cate ===
                                                          "laptop"
                                                              ? product.img.map(
                                                                    (
                                                                        img,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <LazyLoadImage
                                                                                src={
                                                                                    img
                                                                                }
                                                                                alt=""
                                                                                effect="blur"
                                                                                className={`${
                                                                                    index +
                                                                                        1 >
                                                                                    1
                                                                                        ? "hidden"
                                                                                        : "block"
                                                                                } size-[40px] object-contain`}
                                                                            />
                                                                        );
                                                                    }
                                                                )
                                                              : ""}
                                                          {product.cate ===
                                                          "phone" ? (
                                                              <img
                                                                  src={
                                                                      product.img
                                                                  }
                                                                  alt=""
                                                                  className="size-[40px] object-contain"
                                                              />
                                                          ) : (
                                                              ""
                                                          )}
                                                      </td>
                                                      <td className="px-5 py-5">
                                                          {product.id}
                                                      </td>
                                                      <td className="px-5 py-5">
                                                          {product.name}
                                                      </td>
                                                      <td className="px-5 py-5">
                                                          {product.cate}
                                                      </td>
                                                      <td className="px-5 py-5">
                                                          {product.brand}
                                                      </td>
                                                      <td className="px-5 py-5 text-red-500">
                                                          {product.sales}
                                                      </td>
                                                      <td className="px-5 py-5 text-gray-500">
                                                          {product.oldPrice
                                                              ? `$${product.oldPrice}`
                                                              : null}
                                                      </td>
                                                      <td className="px-5 py-5">
                                                          ${product.newPrice}
                                                      </td>
                                                      <td className="px-5 py-5 flex items-center gap-3">
                                                          <PencilSquareIcon
                                                              className="size-[20px] text-blue-500 hover:cursor-pointer"
                                                              onClick={() => {
                                                                  setIsEdit(
                                                                      true
                                                                  );
                                                                  setProductEdit(
                                                                      product
                                                                  );
                                                              }}
                                                          />
                                                          <TrashIcon
                                                              className="size-[20px] text-red-500 hover:cursor-pointer"
                                                              onClick={() => {
                                                                  setIsDelete(
                                                                      true
                                                                  );
                                                                  setProductWantDelete(
                                                                      product
                                                                  );
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
