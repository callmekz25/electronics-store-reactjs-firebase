import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
export const Error = () => {
    return (
        <>
            <Nav />
            <div className="lg:py-[80px] lg:px-[135px]">
                <div className="flex items-center gap-2">
                    <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                        Home
                    </span>
                    <span className="text-[14px] font-normal opacity-40 leading-[21px]">
                        /
                    </span>
                    <span className="text-black text-[14px] font-normal  leading-[21px]">
                        404 Error
                    </span>
                </div>
                <div className="flex items-center justify-center py-[140px]">
                    <div className="flex flex-col gap-[40px] items-center">
                        <h1 className="lg:text-[110px] font-medium lg:leading-[115px] lg:tracking-[3.3px]">
                            404 Not Found
                        </h1>
                        <span className="text-[16px] font-normal leading-[24px]">
                            Your visited page not found. You may go home page.
                        </span>
                        <Link to="/">
                            <button className="text-[16px] text-white font-medium leading-[24px] flex items-center justify-center px-[48px] py-[16px] bg-[#DB4444] rounded mt-[40px]">
                                Back to home page
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};
