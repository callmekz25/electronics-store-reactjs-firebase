import "./App.css";
import React, { useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
// Animation Lib
import AOS from "aos";
import "aos/dist/aos.css";

import RouteApp from "./routes/RouteApp";
function App() {
  // Animation init

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "cubic-bezier(0.42, 0, 0.58, 1)", // Hiệu ứng easing mượt mà
      once: true,
    });
  }, []);

  return <RouteApp />;
}

export default App;
