import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminLoanItem from "./AdminLoanItem";
import { useNavigate } from "react-router-dom";

const GetRecent = ({allLoans}) => {
  const [recentLoans, setRecentLoans] = useState([]);
  const navigate=useNavigate();

  return (
    <div className=" flex-wrap flex flex-col gap-2">
      <div className=" flex-between w-full">
        <h1 className="text-xl max-sm:text-lg font-medium mt-2">Recent Loan Applications</h1>
        <p onClick={()=> navigate("/loansAdmin")} className=" max-sm:hidden font-medium cursor-pointer text-blue-500 hover:text-blue-400">View All</p>
      </div>

        <div className=" grid grid-cols-3 w-full max-lg:grid-cols-2 gap-3 max-sm:grid-cols-1 my-1 mt-2">
            {allLoans.map((loan,i)=> {
                if(i<=6) {
                    return (
                        <div className="w-full max-sm:flex-center">
                            <AdminLoanItem loan={loan} showBtns={false} key={i} />
                        </div>
                    )
                }else return null;
            })}
        </div>
        <p onClick={()=> navigate("/loansAdmin")} className=" flex-end text-end font-medium cursor-pointer sm:hidden text-blue-500 hover:text-blue-400">View All</p>
    </div>
  );
};

export default GetRecent;


