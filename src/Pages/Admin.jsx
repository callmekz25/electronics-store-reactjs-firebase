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
    const [colors, setColors] = useState("");
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
        const currentDay = `${day}.${month}.${year}`;
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

            if (urls.length > 0) {
                const dataRef = doc(db, "All-products", id);
                const product = {
                    id: id,
                    name: name,
                    brand: brand,
                    img: urls,
                    cate: category,
                    colors: colors,
                    oldPrice: oldPrice,
                    newPrice: newPrice,
                    sales: sales,
                    isSale: isSale,
                    createdAt: currentDay,
                    infomation: {
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
                    },
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

    return (
        <div className="grid grid-cols-6">
            <SideBar isActive={"home"} />
            <div className={`bg-[#ffffff] px-3 py-5 col-span-5`}>
                <span>Create a new product</span>
                <div className=" py-[50px] grid grid-cols-2 px-[100px] gap-[50px]">
                    <div className="flex flex-col gap-2 col-span-2">
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
                        <input
                            type="text"
                            id="pcate"
                            className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                            onChange={(e) => setCategory(e.target.value)}
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
                    <div className="flex flex-col gap-2">
                        <label htmlFor="pcolor">Colors</label>
                        <input
                            type="text"
                            id="pcolor"
                            className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                            onChange={(e) => setColors(e.target.value)}
                        />
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
                        <input
                            type="text"
                            id="pissale"
                            className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                            onChange={(e) => setIsSale(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ptype">Type</label>
                        <input
                            type="text"
                            id="ptype"
                            name="type"
                            value={infomation.type}
                            className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                            onChange={handleInfomation}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="pres">Resolution</label>
                        <input
                            type="text"
                            id="pres"
                            name="resolution"
                            value={infomation.resolution}
                            className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                            onChange={handleInfomation}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="pinch">Inch</label>
                        <input
                            type="number"
                            id="pinch"
                            name="inch"
                            value={infomation.inch}
                            className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                            onChange={handleInfomation}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="pconnector">Connector</label>
                        <input
                            type="text"
                            id="pconnector"
                            name="connector"
                            className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                            value={infomation.connector}
                            onChange={handleInfomation}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="pram">Ram</label>
                        <input
                            type="number"
                            id="pram"
                            name="ram"
                            value={infomation.ram}
                            onChange={handleInfomation}
                            className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="phd">Hard Drive</label>
                        <input
                            type="number"
                            id="hpd"
                            name="hardDrive"
                            className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                            value={infomation.hardDrive}
                            onChange={handleInfomation}
                        />
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
                        <label htmlFor="phz">Hz</label>
                        <input
                            type="number"
                            id="phz"
                            name="hz"
                            className="outline-none border-2 border-gray-300 rounded-md px-3 py-2"
                            value={infomation.hz}
                            onChange={handleInfomation}
                        />
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
                </div>
                <div className="">
                    <button onClick={handlePost}>Create</button>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};
export default Admin;
