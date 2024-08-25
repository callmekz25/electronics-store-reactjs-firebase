import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useCart } from "react-use-cart";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import { Loading } from "../components/Loading";
import { UserContext } from "../Context/UserContext";
import { Error } from "./Error";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

// Firestore & auth từ firebase
import {
    doc,
    getDocs,
    deleteDoc,
    collection,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
const Cart = () => {
    // Kiem tra use log in
    const [fetchCarts, setFetchCarts] = useState(null);
    const { user, loading } = useContext(UserContext);
    const [loadingChange, setLoadingChange] = useState(true);
    // State lấy những products user checked
    const [productChecked, setProductChecked] = useState([]);

    // Sử dụng thư viện thứ 3 react use cart
    const { isEmpty, setItems, items, updateItemQuantity } = useCart();

    const navigate = useNavigate();

    useEffect(() => {
        const fecthUserData = async () => {
            // Nếu người dùng có đăng nhập
            if (user) {
                if (user.role === "user") {
                    const querySnapshot = await getDocs(
                        collection(db, `Carts`, user.userId, "Product")
                    );
                    const carts = querySnapshot.docs.map((doc) => doc.data());
                    setLoadingChange(false);
                    setFetchCarts(carts);
                } else {
                    setFetchCarts([]);
                    return <Error />;
                }
            } else {
                return <Error />;
            }
        };
        fecthUserData();
    }, [user]);

    useEffect(() => {
        if (fetchCarts && fetchCarts) {
            setLoadingChange(false);
            setItems(fetchCarts);
        }
    }, [fetchCarts]);

    // Hàm xử lí khi người dùng loại 1 sản phẩm khỏi giỏ hàng và fetch lên firestore để update
    const handleRemoveItem = async (product) => {
        if (user) {
            if (user.role === "user") {
                // setUser(user);
                // Lấy ra những items đã add carts khác id với sản phẩm người dùng bấm remove
                const updateItems = items.filter((f) => f.id !== product.id);
                // Set state lại những sản phẩm đã lọc qua
                setItems(updateItems);
                // Update lên firestore của người dùng
                // Xóa document trong Firestore
                const cartRef = doc(
                    db,
                    `Carts`,
                    user.userId,
                    "Product",
                    product.id
                );
                // Xóa document tương ứng với productId bị remove
                await deleteDoc(cartRef);
                if (deleteDoc) {
                    toast.success(`Remove ${product.name} successfully `, {
                        position: "top-center",
                        autoClose: 1500,
                    });
                }
            }
        }
    };
    const handleUpdateQuantityPlus = async (product) => {
        if (user) {
            if (user.role === "user") {
                const quantity = product.quantity + 1;
                const cartRef = doc(
                    db,
                    `Carts `,
                    user.userId,
                    "Product",
                    product.id
                );

                await updateDoc(cartRef, {
                    quantity: quantity,
                });
            }
        }
    };
    const handleUpdateQuantityMinus = async (product) => {
        if (user) {
            if (user.role === "user") {
                const quantity = product.quantity - 1;
                const cartRef = doc(
                    db,
                    `Carts`,
                    user.userId,
                    "Product",
                    product.id
                );

                await updateDoc(cartRef, {
                    quantity: quantity,
                });
            }
        }
    };
    // Hàm lấy ra những sản phẩm người dùng selected
    const handleSelectedProducts = (product) => {
        setProductChecked((prev) =>
            prev.includes(product)
                ? prev.filter((a) => a.id !== product.id)
                : [...prev, product]
        );
    };
    // Tính tổng số tiền nhân với số lượng mà user selected những sản phẩm
    const totalPriceProductsSelected = useMemo(() => {
        const result = productChecked.reduce((result, product) => {
            return result + product.price * product.quantity;
        }, 0);
        return result;
    }, [productChecked]);

    // Hàm xử lí user đã chọn những sản phẩm và bấm check out
    const handleCheckOut = () => {
        if (productChecked.length === 0) {
            toast.warn("Please choose your product want to check out");
        } else {
            const ids = productChecked.map((product) => product.id).join(",");
            navigate(`/checkout/state=/${ids}`, {
                state: {
                    products: productChecked,
                    total: totalPriceProductsSelected,
                },
            });
        }
    };
    return (
        <div className="">
            {loading || loadingChange ? (
                <Loading />
            ) : (
                <div className="">
                    <Nav />
                    <div className="px-[135px]">
                        <div className="flex items-center gap-2 py-[80px]">
                            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                                Home
                            </span>
                            <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                                /
                            </span>
                            <span className="text-black text-[14px] font-normal  leading-[21px]">
                                Cart
                            </span>
                        </div>
                    </div>
                    <div className="px-[135px] flex flex-col gap-[40px] text-[16px] font-normal leading-[24px] pb-[140px]">
                        <div className="flex items-center justify-between px-[40px] py-[24px] rounded shadow-cart font-medium">
                            <span className="w-[300px]">Products</span>
                            <span className="w-[100px]">Types</span>
                            <span className="w-[100px]">Price</span>
                            <span className="w-[100px]">Quantity</span>
                            <span className="w-[100px]">Subtotal</span>
                            <span className="w-[100px]">Actions</span>
                        </div>
                        {isEmpty ? (
                            <div className="flex items-center justify-center py-[100px]">
                                <span className="text-[20px] font-normal leading-[24px] text-[#999999]">
                                    Your cart is empty
                                </span>
                            </div>
                        ) : (
                            items.map((product) => {
                                return (
                                    <div
                                        className="flex items-center justify-between px-[40px] py-[24px] rounded shadow-cart "
                                        key={product.id}
                                    >
                                        <div className="flex items-center gap-4 w-[300px]">
                                            <input
                                                type="checkbox"
                                                name=""
                                                id=""
                                                className="size-4"
                                                onChange={() =>
                                                    handleSelectedProducts(
                                                        product
                                                    )
                                                }
                                            />
                                            <Link
                                                to={`/dp/${product.name}/${product.id}`}
                                                className="flex items-center gap-4 w-[300px]"
                                            >
                                                <LazyLoadImage
                                                    src={product.img}
                                                    className="size-[54px] object-contain"
                                                    effect="blur"
                                                />
                                                <span className="overflow-hidden text-ellipsis">
                                                    {product.name}
                                                </span>
                                            </Link>
                                        </div>
                                        <span className="w-[100px] text-[14px] text-gray-500">
                                            {product.color
                                                ? product.color
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  product.color.slice(1)
                                                : ""}
                                            {product.size ? "," : ""}
                                            {product.size}
                                        </span>
                                        <span className="w-[100px]">{`$${product.price}`}</span>
                                        <div className="flex items-center border-2 border-gray-400 rounded-s py-1 rounded-e px-2 w-[100px]">
                                            <div
                                                className="flex items-center justify-center hover:cursor-pointer text-[16px]"
                                                onClick={() => {
                                                    if (product.quantity > 1) {
                                                        updateItemQuantity(
                                                            product.id,
                                                            product.quantity - 1
                                                        );
                                                        handleUpdateQuantityMinus(
                                                            product
                                                        );
                                                    } else {
                                                        handleRemoveItem(
                                                            product
                                                        );
                                                    }
                                                }}
                                            >
                                                <MinusIcon className="size-[20px]" />
                                            </div>
                                            <div className="flex items-center justify-center w-[50px] text-[17px] font-medium leading-[28px]">
                                                {product.quantity}
                                            </div>
                                            <div
                                                className="flex items-center justify-center hover:cursor-pointer text-[16px]"
                                                onClick={() => {
                                                    updateItemQuantity(
                                                        product.id,
                                                        product.quantity + 1
                                                    );
                                                    handleUpdateQuantityPlus(
                                                        product
                                                    );
                                                }}
                                            >
                                                <PlusIcon className="size-[20px]" />
                                            </div>
                                        </div>
                                        <span className="w-[100px] text-red-500 font-medium ">
                                            {`$${
                                                Math.round(
                                                    product.quantity *
                                                        product.price *
                                                        100
                                                ) / 100
                                            }  `}
                                        </span>

                                        <div className="w-[100px]">
                                            <button
                                                className=" w-fit"
                                                onClick={() =>
                                                    handleRemoveItem(product)
                                                }
                                            >
                                                <TrashIcon className="size-[25px] text-red-500 " />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        <div className="pt-[40px] flex justify-end gap-">
                            <div className="border border-black rounded px-[24px] py-[32px] flex flex-col gap-[24px] ">
                                <span className="text-[20px] font-medium leading-[28px]">
                                    Cart Total
                                </span>
                                <div className="border-b-2 border-gray-300 pb-2 flex items-center  justify-between text-[16px] font-normal leading-[24px]">
                                    <span className="">Total Amount:</span>
                                    <span className="text-[#DB4444] font-medium text-[18px] w-[200px] text-end">{`$${
                                        Math.round(
                                            totalPriceProductsSelected * 100
                                        ) / 100
                                    }`}</span>
                                </div>
                                <button
                                    className="bg-[#DB4444] px-[48px] py-4 text-white font-medium text-[16px] leading-[24px] rounded w-fit mx-auto"
                                    onClick={handleCheckOut}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            )}
            <ToastContainer />
        </div>
    );
};
export default Cart;
