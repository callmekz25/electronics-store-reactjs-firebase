import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import { Loading } from "../components/Loading";
import { useContext } from "react";

import { useQuery } from "@tanstack/react-query";
import { fetchAllUser } from "../FetchAPI/FetchAPI";
import { UserContext } from "../Context/UserContext";
import { Error } from "./Error";
const Customers = () => {
  const { user, loading } = useContext(UserContext);
  // const { customers, setCustomers } = useContext(DataContext);
  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: () => fetchAllUser(user),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return <Error />;
  }
  return (
    <div className="grid grid-cols-6">
      <SideBar isActive={"customers"} />
      {loading || isLoading ? (
        <div className="col-span-5">
          <Loading />
        </div>
      ) : (
        <div className={`bg-[#f0f1f3] px-[50px] py-5 col-span-5 `}>
          <h2 className="text-[25px] font-semibold">Customers</h2>
          <div className=" py-[50px]">
            <div className="bg-[#ffffff] rounded-lg py-5 px-3 w-full">
              <table
                className="w-full"
                style={{ padding: "20px" }}
              >
                <thead className="text-[#667085]">
                  <tr className="text-[15px] font-medium">
                    <td className="px-5 py-3 rounded-tl-lg rounded-bl-lg">
                      ID
                    </td>
                    <td className="px-5 py-3">Customer</td>
                    <td className="px-5 py-3">Date</td>
                    <td className="px-5 py-3">Email</td>
                    <td className="px-5 py-3">Phone</td>
                    <td className="px-5 py-3">Address</td>
                    <td className="px-5 py-3 rounded-tr-lg rounded-br-lg">
                      Verify
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {customers
                    ? customers.map((customer) => {
                        return (
                          <tr
                            className="text-[14px] border-b-2 border-[#f5f5f5] font-medium"
                            key={customer.userId}
                          >
                            <td className="px-5 py-5">{customer.userId}</td>
                            <td className="px-5 py-5">{customer.name}</td>
                            <td className="px-5 py-5">{customer.date}</td>
                            <td className="px-5 py-5">{customer.email}</td>
                            <td className="px-5 py-5">
                              {customer.phone || "null"}
                            </td>
                            <td className="px-5 py-5">
                              {customer.address || "null"}
                            </td>
                            <td className="px-5 py-5 text-green-400">
                              {customer.verify}
                            </td>
                          </tr>
                        );
                      })
                    : "Customers is empty"}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Customers;
