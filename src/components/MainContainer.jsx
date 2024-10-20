import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { TOKEN, USER } from "../constants";
import Dashboard from "./Dashboard";
import CustomerHome from "./CustomerHome";

const MainContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currUser = useSelector((state) => state?.reducer?.user);

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

  if (!currUser) return null;

  return (
    <>
      <div className={` ${currUser.role === "customer" ? "bg-black" : ""}`}>
        <div className="  h-full mx-auto w-full max-w-7xl ">
          {currUser.role === "customer" ? (
            <div className=" flex flex-col bg-hero_img bg-cover ">
              <HeroSection />
            </div>
          ) : (
            <div className="">
              <Dashboard />
            </div>
          )}
        </div>
      </div>
      <div className="h-full mx-auto w-full max-w-7xl py-4 px-2 bg-white">
        {currUser.role==="customer" && (
          <CustomerHome />
        )}
      </div>
    </>
  );
};

export default MainContainer;
