import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import { CartProvider } from "react-use-cart";
import { UserProvider } from "./Context/UserContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <QueryClientProvider client={queryClient}>
        <UserProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </UserProvider>
    </QueryClientProvider>
);
