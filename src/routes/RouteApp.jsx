import "../App.css";
import React, { Suspense, lazy, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Loading } from "../components/Loading";
import { Error } from "../Pages/Error";
import { UserContext } from "../Context/UserContext";
// Lazy load các component
const Home = lazy(() => import("../Pages/Home"));
const LogIn = lazy(() => import("../Pages/LogIn"));
const SignUp = lazy(() => import("../Pages/SignUp"));
const AllProductsSales = lazy(() => import("../Pages/SaleProduct"));
const Contact = lazy(() => import("../Pages/Contact"));
const About = lazy(() => import("../Pages/About"));
const Phones = lazy(() => import("../Pages/Phone"));
const Laptops = lazy(() => import("../Pages/Laptop"));
const ProductDetail = lazy(() => import("../Pages/ProductDetail"));
const Profile = lazy(() => import("../Pages/Profile"));
const Cart = lazy(() => import("../Pages/Cart"));
const Checkout = lazy(() => import("../Pages/Checkout"));
const MyOrders = lazy(() => import("../Pages/MyOrders"));
const OrderDetails = lazy(() => import("../Pages/OrderDetails"));
const OrdersCancel = lazy(() => import("../Pages/OrdersCancel"));
const OrdersShipping = lazy(() => import("../Pages/OrdersShipping"));
const PageReviews = lazy(() => import("../Pages/ReviewsProduct"));
// Admin page
const Admin = lazy(() => import("../Pages/Admin"));
const OrdersUser = lazy(() => import("../Pages/OrderUser(admin)"));
const Customers = lazy(() => import("../Pages/Customer"));
const OrdersList = lazy(() => import("../Pages/OrderList(admin)"));
const ProductsList = lazy(() => import("../Pages/ProductList(admin)"));
const RouteApp = () => {
    // Lấy ra trạng thái nếu có user đăng nhập
    const { user } = useContext(UserContext);

    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route
                        path="*"
                        element={<Error />}
                    />
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    {/*  Check user khi chuyển router admin  */}
                    <Route
                        path="/admin"
                        element={
                            user ? (
                                user.role === "admin" ? (
                                    <Admin />
                                ) : (
                                    <Error />
                                )
                            ) : (
                                <LogIn />
                            )
                        }
                    />

                    <Route
                        path="/admin/orders/user=/:userId"
                        element={
                            user ? (
                                user.role === "admin" ? (
                                    <OrdersUser />
                                ) : (
                                    <Error />
                                )
                            ) : (
                                <LogIn />
                            )
                        }
                    />
                    <Route
                        path="/admin/customers"
                        element={
                            user ? (
                                user.role === "admin" ? (
                                    <Customers />
                                ) : (
                                    <Error />
                                )
                            ) : (
                                <LogIn />
                            )
                        }
                    />
                    <Route
                        path="/admin/orders"
                        element={
                            user ? (
                                user.role === "admin" ? (
                                    <OrdersList />
                                ) : (
                                    <Error />
                                )
                            ) : (
                                <LogIn />
                            )
                        }
                    />
                    <Route
                        path="/admin/products"
                        element={
                            user ? (
                                user.role === "admin" ? (
                                    <ProductsList />
                                ) : (
                                    <Error />
                                )
                            ) : (
                                <Loading />
                            )
                        }
                    />

                    <Route
                        path="/sign-up"
                        element={<SignUp />}
                    />
                    <Route
                        path="/:cate/:productName/reviews"
                        element={<PageReviews />}
                    />
                    <Route
                        path="/log-in"
                        element={<LogIn />}
                    />
                    <Route
                        path="/profile"
                        element={user ? <Profile /> : <Loading />}
                    />

                    <Route
                        path="/orders/purchase/status=all"
                        element={<MyOrders />}
                    />
                    <Route
                        path="/orders/purchase/status=shipping"
                        element={<OrdersShipping />}
                    />
                    <Route
                        path="/orders/purchase/status=canceled"
                        element={<OrdersCancel />}
                    />

                    <Route
                        path="/order-detail/:orderId"
                        element={<OrderDetails />}
                    />

                    <Route
                        path="/contact"
                        element={<Contact /> ? <Contact /> : <Error />}
                    />
                    <Route
                        path="/about"
                        element={<About />}
                    />
                    <Route
                        path="/carts"
                        element={user ? <Cart /> : <Loading />}
                    />
                    <Route
                        path="/sales"
                        element={
                            <AllProductsSales /> ? (
                                <AllProductsSales />
                            ) : (
                                <Error />
                            )
                        }
                    />
                    <Route
                        path="/checkout/state=/:productId"
                        element={<Checkout /> ? <Checkout /> : <Error />}
                    />

                    <Route
                        path="dp/:productName/:productId"
                        element={
                            <ProductDetail /> ? <ProductDetail /> : <Error />
                        }
                    />
                    <Route
                        path="/phones"
                        element={<Phones /> ? <Phones /> : <Error />}
                    />
                    <Route
                        path="/laptops"
                        element={<Laptops /> ? <Laptops /> : <Error />}
                    />
                </Routes>
            </Suspense>
        </Router>
    );
};
export default RouteApp;
