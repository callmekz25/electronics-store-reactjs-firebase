import { Pagination } from "../components/Pagination";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { useState, useEffect } from "react";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { ListProductsSales } from "../components/ListProductsSales";
import { Error } from "./Error";
import { Loading } from "../components/Loading";
const AllProductsSales = () => {
    // Pagination
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(8);
    // Loading
    const [loading, setLoading] = useState(true);
    // Sản phẩm sale
    const [productsSale, setProductsSale] = useState([]);
    // Kết nối firbase
    const dbRef = ref(database);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const laptopsSnapshot = await get(
                    child(dbRef, "all-products/laptops")
                );
                let laptopsData = [];
                if (laptopsSnapshot.exists()) {
                    laptopsData = laptopsSnapshot.val();
                } else {
                    console.log("No data available for laptops");
                }

                const phonesSnapshot = await get(
                    child(dbRef, "all-products/phones")
                );
                let phonesData = [];
                if (phonesSnapshot.exists()) {
                    phonesData = phonesSnapshot.val();
                } else {
                    console.log("No data available for phones");
                }

                // Đẩy dữ liệu từ 2 api vào 1 mảng
                const combinedData = [...laptopsData, ...phonesData];

                setProducts(combinedData);
                if (products) {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                return <Error />;
            }
        };

        fetchData();
    }, [dbRef]);
    // Lấy ra những sản phẩm đang sale
    useEffect(() => {
        const fetchSale = () => {
            const data = products.filter((product) => product.isSale);
            setProductsSale(data);
        };
        fetchSale();
    }, [products]);

    // Tìm ra vị trí cuối của product 1 * 8 = 8
    const lastPostIndex = currentPage * postsPerPage;
    // Tìm ra vị trí đầu của product 8 - 8 = 0
    const firstPostIndex = lastPostIndex - postsPerPage;
    // Lấy ra những products từ vị trí đầu tới cuối 0 - 8
    const currentPosts = productsSale.slice(firstPostIndex, lastPostIndex);

    return (
        <div className="">
            {loading ? (
                <Loading />
            ) : productsSale.length > 0 ? (
                <div className="">
                    <Nav />
                    <div className="px-[135px] py-[80px]">
                        <ListProductsSales products={currentPosts} />
                        <div className="flex items-center justify-center">
                            <Pagination
                                totalPosts={productsSale.length}
                                postsPerPage={postsPerPage}
                                // Callback để lấy ra currentPage để tính toán lại index và lấy ra products để render
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                    <Footer />
                </div>
            ) : (
                <Error />
            )}
        </div>
    );
};
export default AllProductsSales;
