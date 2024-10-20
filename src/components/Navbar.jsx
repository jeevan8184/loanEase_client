import React, { useEffect } from "react";
import { MdAccountBalance, MdClose, MdMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AdminItems, NavItems, TOKEN, USER } from "../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, Divider, Drawer } from "@mui/material";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Navbar = () => {
  const currUser = useSelector((state) => state.reducer.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const newFunc = async () => {
      if (token) {
        const decoded = jwtDecode(token);
        // console.log("decoded",decoded);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        const api = await axios.get(
          `${process.env.REACT_APP_URL}/auth/user/${decoded?.id}`
        );
        dispatch({ type: USER, payload: api?.data });
        dispatch({ type: TOKEN, payload: token });
      } else {
        navigate("/login");
      }
    };
    newFunc();
  }, [token]);

  console.log("currUser", currUser);

  if (!currUser) return null;

  return (
    <div className="w-full flex justify-center bg-[#002B5B] py-4 px-6 max-sm:py-3 shadow-md">
      <div className="max-w-7xl w-full flex justify-between items-center">
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

        {currUser?.role === "admin" ? (
          <div className=" flex gap-8 items-center max-sm:hidden max-md:gap-6">
            {AdminItems.map(({ label, route }, i) => {
              const isActive = pathname === route;
              return (
                <div className="" key={i}>
                  <div
                    onClick={() => navigate(route)}
                    className={`${
                      isActive ? "text-[#00A8E8]" : "text-white"
                    } hover:text-[#00A8E8] cursor-pointer text-[17px] transition duration-300`}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
            <div
              className=" cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <Avatar
                src={currUser.profilePic}
                alt="image"
                className="rounded-full shadow-md "
              />
            </div>
          </div>
        ) : (
          <div className=" flex gap-8 items-center max-sm:hidden max-md:gap-6">
            {NavItems.map(({ label, route }, i) => {
              const isActive = pathname === route;
              return (
                <div className="" key={i}>
                  <div
                    onClick={() => navigate(route)}
                    className={`${
                      isActive ? "text-[#00A8E8]" : "text-white"
                    } hover:text-[#00A8E8] cursor-pointer text-[17px] transition duration-300`}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
            <div
              className=" cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <Avatar
                src={currUser.profilePic}
                alt="image"
                className="rounded-full shadow-md "
              />
            </div>
          </div>
        )}

        <div className=" sm:hidden  ">
          <MdMenu
            size={24}
            style={{ color: "white", cursor: "pointer" }}
            onClick={() => setIsOpen((prev) => !prev)}
          />
          <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
            <div className="w-60 h-full bg-[#002B5B] p-4 flex flex-col gap-6">
              <div className=" text-end flex-end">
                <MdClose
                  className=" cursor-pointer flex-end"
                  size={24}
                  style={{ color: "white" }}
                  onClick={() => setIsOpen((prev) => !prev)}
                />
              </div>
              {NavItems.map(({ label, route }, i) => {
                const isActive = pathname === route;

                return (
                  <div className=" group" key={i}>
                    <div
                      onClick={() => {
                        navigate(route);
                        setIsOpen((prev) => !prev);
                      }}
                      className={`${
                        isActive ? "text-[#00A8E8]" : "text-white"
                      } hover:text-[#00A8E8] cursor-pointer text-[17px] transition duration-300`}
                    >
                      {label}
                    </div>
                    <Divider style={{ height: "1px", marginTop: "10px" }} />
                  </div>
                );
              })}
              <div
                className=" cursor-pointer mb-2 flex gap-2 items-center"
                onClick={() => navigate("/profile")}
              >
                <Avatar
                  src={currUser.profilePic}
                  alt="image"
                  className="rounded-full shadow-md "
                />
                <p className="text-white py-1.5 px-2 rounded-md block hover:text-[#00A8E8] text-[17px] transition duration-300">
                  {currUser?.username}
                </p>
              </div>
              <Divider />
            </div>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Navbar;


