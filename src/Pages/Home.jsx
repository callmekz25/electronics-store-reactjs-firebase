import { Loading } from "../components/Loading";
import Nav from "../components/Nav";
import { Category } from "../components/Category";
import { Section } from "../components/Section";
import { Today } from "../components/Today";
import { Month } from "../components/Month";
import { SpecialProduct } from "../components/SpecialProduct";
import ExploreProducts from "../components/ExploreProducts";
import Featured from "../components/Featured";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import { useContext, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
const Home = () => {
  const { loading } = useContext(UserContext);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="App lg:px-[135px] bg-[#ffff]">
      <Nav />
      <Section />
      <Today />
      <Category />
      <Month />
      <SpecialProduct />
      <ExploreProducts />
      <Featured />
      <Footer />
      <ToastContainer />
    </div>
  );
};
export default Home;
