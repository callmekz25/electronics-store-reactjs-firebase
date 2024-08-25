import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export const fetchProductsLaptop = async () => {
    const queryProducts = await query(
        collection(db, "All-products"),
        where("cate", "==", "laptop")
    );
    const querySnap = await getDocs(queryProducts);
    const productsData = querySnap.docs.map((doc) => doc.data());
    return productsData;
};
export const fetchProductsPhone = async () => {
    const queryProducts = await query(
        collection(db, "All-products"),
        where("cate", "==", "phone")
    );
    const querySnap = await getDocs(queryProducts);
    const productsData = querySnap.docs.map((doc) => doc.data());
    return productsData;
};
export const fetchProductById = async (productId) => {
    const dataRef = doc(db, "All-products", productId);
    const dataSnap = await getDoc(dataRef);
    const getDatas = await dataSnap.data();
    return getDatas;
};
export const fetchAllOrders = async (user) => {
    if (user) {
        if (user.role === "admin") {
            try {
                const allOrdersRef = collection(db, "AllOrders");
                const allOrdersSnap = await getDocs(allOrdersRef);
                const allOrdersData = allOrdersSnap.docs.map((doc) =>
                    doc.data()
                );
                return allOrdersData;
            } catch (e) {
                console.log(e.message);
            }
        }
    }
};
export const fetchAllProducts = async (user) => {
    if (user) {
        if (user.role === "admin") {
            const productsRef = collection(db, "All-products");
            const productsSnap = await getDocs(productsRef);
            const productsData = await productsSnap.docs.map((doc) =>
                doc.data()
            );
            return productsData;
        }
    }
};
export const fetchAllUser = async (user) => {
    if (user) {
        if (user.role === "admin") {
            const customersRef = collection(db, "Users");
            const customersSnap = await getDocs(customersRef);
            const customsersData = customersSnap.docs.map((doc) => doc.data());

            return customsersData;
        } else {
            return [];
        }
    }
};
export const fetchReviewsByProductId = async (data) => {
    if (data) {
        const reviewsQuery = query(
            collection(db, "Reviews"),
            where("productID", "==", `${data.id}`)
        );
        const reviewsSnap = await getDocs(reviewsQuery);
        const reviewsData = reviewsSnap.docs.map((doc) => doc.data());
        return reviewsData;
    } else {
        return [];
    }
};

export const fetchBestSellingProducts = async () => {};
