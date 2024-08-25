import "./App.css";
import React, { Suspense, lazy, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Loading } from "./components/Loading";
// Animation Lib
import AOS from "aos";
import "aos/dist/aos.css";
import { Error } from "./Pages/Error";
import { UserContext } from "./Context/UserContext";
import RouteApp from "./routes/RouteApp";
function App() {
    // Animation init
    useEffect(() => {
        AOS.init({
            duration: 1200,
        });
    }, []);
    return <RouteApp />;
}

export default App;
