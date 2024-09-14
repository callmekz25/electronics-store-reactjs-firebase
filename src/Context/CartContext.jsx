import { createContext, useContext, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { UserContext } from "./UserContext";
import { fetchCartsByUser } from "../FetchAPI/FetchAPI";
import { doc, deleteDoc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
export const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(UserContext);
  const [isLogIn, setIsLogIn] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [removeSuccess, setRemoveSuccess] = useState(false);
  const {
    data: cartItems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["carts", user?.userId],
    queryFn: () => fetchCartsByUser(user),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  const addToCartMutation = useMutation({
    mutationFn: async (product, count) => {
      if (user) {
        if (user.role === "user") {
          setIsLogIn(false);
          const cartRef = doc(db, `Carts`, user.userId, "Product", product.id);
          const cartProduct = await getDoc(cartRef);
          if (cartProduct.exists()) {
            await updateDoc(cartRef, {
              quantity: cartProduct.data().quantity + count,
            });
          } else {
            await setDoc(cartRef, product);
          }
        }
      } else {
        setIsLogIn(true);
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries("carts", user?.userId); // Làm mới giỏ hàng sau khi thêm
        setAddSuccess(true);
        setTimeout(() => {
          setAddSuccess(false);
        }, 1000);
      } else {
        setIsLogIn(true);
      }
    },
  });
  const removeCartMutation = useMutation({
    mutationFn: async (product) => {
      if (user) {
        if (user.role === "user") {
          // Update lên firestore của người dùng
          // Xóa document trong Firestore
          const cartRef = doc(db, `Carts`, user.userId, "Product", product.id);
          // Xóa document tương ứng với productId bị remove
          await deleteDoc(cartRef);
        }
      } else {
        setIsLogIn(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("carts", user?.userId); // Làm mới giỏ hàng sau khi thêm
      setRemoveSuccess(true);
    },
  });
  const updateQuantityPlusCartItems = useMutation({
    mutationFn: async (product) => {
      if (user) {
        if (user.role === "user") {
          setIsLogIn(true);
          const quantity = product.quantity + 1;
          const cartRef = doc(db, `Carts`, user.userId, "Product", product.id);

          await updateDoc(cartRef, {
            quantity: quantity,
          });
        }
      } else {
        setIsLogIn(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("carts", user?.userId); // Làm mới giỏ hàng sau khi thêm
    },
  });
  const updateQuantityMinusMutation = useMutation({
    mutationFn: async (product) => {
      if (user) {
        if (user.role === "user") {
          const quantity = product.quantity - 1;
          const cartRef = doc(db, `Carts`, user.userId, "Product", product.id);

          await updateDoc(cartRef, {
            quantity: quantity,
          });
        }
      } else {
        setIsLogIn(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("carts", user?.userId); // Làm mới giỏ hàng sau khi thêm
    },
  });

  const addToCart = (product, count) => {
    addToCartMutation.mutate(product, count);
  };
  const removeToCart = (product) => {
    removeCartMutation.mutate(product);
  };
  const updatePlus = (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    updateQuantityPlusCartItems.mutate(product);
  };
  const updateMinus = (product, e) => {
    e.stopPropagation();
    e.preventDefault();
    updateQuantityMinusMutation.mutate(product);
  };

  return (
    <CartContext.Provider
      value={{
        isLogIn,
        setIsLogIn,
        isLoading,
        isError,
        cartItems,
        addToCart,
        addSuccess,
        removeSuccess,
        removeToCart,
        updateMinus,
        updatePlus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
