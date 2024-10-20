import React from "react";
import { MdAccountBalance } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AdminItems1, NavItems, NavItems1 } from "../constants";
import { useSelector } from "react-redux";


const Footer = () => {
  const navigate = useNavigate();
  const currUser=useSelector((state)=> state.reducer.user);

  if(!currUser) return null;
  return (
    <footer className="w-full h-full mt-10 max-sm:mt-4 flex justify-center bg-[#002B5B] py-8 px-6 max-sm:py-5 shadow-md">
      <div className="max-w-7xl w-full">
        <div className=" flex flex-col items-center gap-4">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <MdAccountBalance
              className="text-[#00A8E8] hover:text-[#0078A8] transition-colors duration-300 ease-in-out max-sm:hidden"
              size={45}
              style={{
                padding: "7px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "2px solid #e0e0e0",
              }}
            />
            <MdAccountBalance
              className="text-[#00A8E8] hover:text-[#0078A8] transition-colors duration-300 ease-in-out sm:hidden"
              size={38}
              style={{
                padding: "7px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "2px solid #e0e0e0",
              }}
            />
            <h1 className="text-3xl max-sm:text-[26px] font-bold text-white tracking-wide">
              LoanEase
            </h1>
          </div>
          <div className=" mt-6">
            {currUser.role==="customer" ? (
              <div className=" flex gap-16 items-center max-md:gap-8 max-sm:flex-col">
              {NavItems1.map(({ label, route }, i) => {
                return (
                  <div className="" key={i}>
                    <div
                      onClick={() => navigate(route)}
                      className={`text-white hover:text-[#00A8E8] cursor-pointer text-[17px] transition duration-300`}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
            ):(
              <div className=" flex gap-20 items-center max-md:gap-8 max-sm:flex-col">
              {AdminItems1.map(({ label, route }, i) => {
                return (
                  <div className="" key={i}>
                    <div
                      onClick={() => navigate(route)}
                      className={`text-white hover:text-[#00A8E8] cursor-pointer text-[17px] transition duration-300`}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
          <div className=" text-gray-50 text-sm mt-20 flex flex-col gap-1">
            <p className="">Conditions of Use & Sale {"    "} Privacy Notice</p>
            <p className="">�� 2023 LoanEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
