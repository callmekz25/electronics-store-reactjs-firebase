import React, { createContext, useState, useEffect } from "react";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    FieldValue,
    deleteField,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAuth } from "firebase/auth";
import { Error } from "../Pages/Error";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // useEffect(() => {
    //     const updateProduct = async () => {
    //         if (data) {
    //             data.map(async (data) => {
    //                 if (data.id && data.cate === "phone") {
    //                     await updateDoc(doc(db, "All-products", data.id), {
    //                         id: data.id,
    //                         name: data.name,
    //                         img: [data.img],
    //                         brand: data.brand,
    //                         cate: data.cate,
    //                         colors: [""],
    //                         sales: data.sales,
    //                         isSale: data.isSale || "false",
    //                         newPrice: data.newPrice,
    //                         oldPrice: data.oldPrice,
    //                         colors: [
    //                             data.colours1,
    //                             data.colours2,
    //                             data.colours3,
    //                         ],
    //                         infomation: {
    //                             type: data.type || "",
    //                             frontCamera: "",
    //                             behindCamera: "",
    //                             connector: "",
    //                             pin: "",
    //                             ram: data.ram,
    //                             cpu: "",
    //                             inch: "",
    //                             hz: data.hz,
    //                             resolution: "",
    //                             weight: "",
    //                         },
    //                         colours1: deleteField(),
    //                         colours2: deleteField(),
    //                         colours3: deleteField(),
    //                         //                         type: deleteField(),
    //                         //                         connector: deleteField(),
    //                         //                         pin: deleteField(),
    //                         ram: deleteField(),
    //                         //                         cpu: deleteField(),
    //                         //                         hardDrive: deleteField(),
    //                         //                         inch: deleteField(),
    //                         //                         card: deleteField(),
    //                         hz: deleteField(),
    //                         //                         resolution: deleteField(),
    //                         //                         weight: deleteField(),
    //                     });
    //                 } else {
    //                     console.log("Missing", data);
    //                 }
    //             });
    //         }
    //     };
    //     updateProduct();
    // }, [data]);

    // Context user trên firestore sau khi đăng nhập
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            // Check đã xác thực email chưa mới log in
            try {
                if (user) {
                    if (user.emailVerified) {
                        const userRef = doc(db, "Users", user.uid);
                        const getUser = await getDoc(userRef);
                        if (getUser.exists()) {
                            setUser(getUser.data());
                        }
                    } else {
                        return <Error />;
                    }
                } else {
                    setUser(null);
                    return <Error />;
                }
            } catch (e) {
                return <Error />;
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);
    // Context lấy ra user hiện tại của firebase auth
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });

        // Clean up the subscription
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider
            value={{ user, currentUser, setUser, loading, setLoading }}
        >
            {children}
        </UserContext.Provider>
    );
};
