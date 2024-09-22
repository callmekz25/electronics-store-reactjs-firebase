import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  deleteDoc,
  setDoc,
  updateDoc,
  limit,
  orderBy,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "../firebase";
import { Error } from "../Pages/Error";

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
        const allOrdersData = allOrdersSnap.docs.map((doc) => doc.data());
        return allOrdersData;
      } catch (e) {}
    }
  }
};
export const fetchAllProducts = async (user) => {
  if (user) {
    if (user.role === "admin") {
      const productsRef = collection(db, "All-products");
      const productsSnap = await getDocs(productsRef);
      const productsData = await productsSnap.docs.map((doc) => doc.data());
      return productsData;
    }
  }
};
export const fetchProductsIsSaleLimit = async () => {
  try {
    const queryProducts = await query(
      collection(db, "All-products"),
      where("isSale", "==", true),
      limit(4)
    );

    const querySnap = await getDocs(queryProducts);
    const productsData = querySnap.docs.map((doc) => doc.data());
    if (productsData) {
      return productsData;
    } else {
      return [];
    }
  } catch (e) {
    return <Error />;
  }
};
export const fetchProductsIsSale = async () => {
  try {
    const queryProducts = await query(
      collection(db, "All-products"),
      where("isSale", "==", true)
    );
    const querySnap = await getDocs(queryProducts);
    const productsData = querySnap.docs.map((doc) => doc.data());
    if (productsData) {
      return productsData;
    } else {
      return [];
    }
  } catch (e) {
    return <Error />;
  }
};
export const fetchProductsBestSellingLimit = async () => {
  try {
    const ref = query(
      collection(db, "All-products"),
      where("quantitySold", ">", 0),
      limit(4)
    );
    const snap = await getDocs(ref);
    const data = snap.docs.map((doc) => doc.data());
    if (data) {
      return data;
    } else {
      return [];
    }
  } catch {
    return <Error />;
  }
};
export const fetchProductsBestSelling = async () => {
  try {
    const ref = query(
      collection(db, "All-products"),
      where("quantitySold", ">", 0)
    );
    const snap = await getDocs(ref);
    const data = snap.docs.map((doc) => doc.data());
    if (data) {
      return data;
    } else {
      return [];
    }
  } catch {
    return <Error />;
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
export const fetchReviewsByProductId = async (productId) => {
  if (productId) {
    const reviewsQuery = await query(
      collection(db, "Reviews"),
      where("productID", "==", productId)
    );
    const reviewsSnap = await getDocs(reviewsQuery);
    const reviewsData = reviewsSnap.docs.map((doc) => doc.data());
    return reviewsData;
  } else {
    return [];
  }
};
export const postReviewByProductId = async (productId, user, star, comment) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const currentDay = `${day}-${month}-${year} ${hours}:${minutes}`;
  const ref = doc(db, "Reviews", uuid());
  const review = {
    productID: productId,
    userID: user.userId,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone || "",
    userAddress: user.address || "",
    rate: star,
    userReview: comment,
    createdAt: currentDay,
  };
  await setDoc(ref, review);
};
export const fetchCartsByUser = async (user) => {
  if (user) {
    if (user.role === "user") {
      const querySnapshot = await getDocs(
        collection(db, `Carts`, user.userId, "Product")
      );
      const carts = querySnapshot.docs.map((doc) => doc.data());
      return carts;
    } else {
      return [];
    }
  } else {
    return <Error />;
  }
};
export const fetchOrdersByUser = async (user) => {
  try {
    if (user) {
      const queryOrdersUSer = await query(
        collection(db, "Orders"),
        where("userId", "==", user.userId)
      );
      const querySnap = await getDocs(queryOrdersUSer);
      const orderUserData = querySnap.docs.map((doc) => doc.data());

      return orderUserData;
    } else {
      return [];
    }
  } catch (error) {
    return <Error />;
  }
};
export const fetchOrdersShipping = async (user) => {
  try {
    if (user) {
      const queryOrdersUSer = query(
        collection(db, "Orders"),
        where("userId", "==", user.userId),
        where("status", "==", "Shipping")
      );
      const querySnap = await getDocs(queryOrdersUSer);
      const orderUserData = querySnap.docs.map((doc) => doc.data());
      return orderUserData;
    } else {
      return [];
    }
  } catch (error) {
    return <Error />;
  }
};
export const fetchOrdersCancel = async (user) => {
  try {
    if (user) {
      const queryOrdersUSer = query(
        collection(db, "Orders"),
        where("userId", "==", `${user.userId}`),
        where("status", "==", "Cancel")
      );
      const querySnap = await getDocs(queryOrdersUSer);
      const orderUserData = querySnap.docs.map((doc) => doc.data());
      return orderUserData;
    } else {
      return [];
    }
  } catch (error) {
    return;
  }
};
