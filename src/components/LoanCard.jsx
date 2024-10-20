import React from "react";
import { useNavigate } from "react-router-dom";

const LoanCard = ({loan}) => {
    const navigate=useNavigate();

  return (
    <div className=" overflow-hidden max-sm:mx-3 rounded-xl border hover:scale-105 sm:hover:scale-105 border-gray-300 shadow">
      <div className=" flex flex-col gap-1">
        <div
          className={`flex-between px-3 py-1 border border-b border-b-gray-300 text-white 
            ${loan.loanStatus==="approved" ? " bg-green-500" : loan.loanStatus==="rejected" ? " bg-red-500" : " bg-yellow-500"  } `}
        >
          <div className=" flex flex-col items-center">
            <p className="">Loan Applied on </p>
            <strong className=" text-sm"> {new Date(loan.createdAt).toDateString()}</strong>
          </div>
          <div className=" flex flex-col items-center">
            <p className="">Loan status </p>
            <strong className=" text-sm">{loan.loanStatus}</strong>
          </div>
        </div>
        <div className=" flex flex-col gap-1 px-4 py-3">
          <p className="">
            Loan Amount : <strong> ₹ {loan.amount.toLocaleString()}</strong>
          </p>
          <p className="">
            Loan Term : <strong> {loan.loanTerm}</strong>
          </p>
          <p className="">
            Repayment frequency : <strong> {loan.frequency}</strong>
          </p>
          <p className="">
            {" "}
            Interest (1%) : <strong> {loan.interest.toLocaleString()}</strong>
          </p>
          <p className="">
            {" "}
            Total Amount with Interest :{" "}
            <strong>
              {" "}
              ₹ {Math.ceil(loan.interest + loan.amount).toLocaleString()}
            </strong>
          </p>
          <button 
            onClick={()=> navigate(`/loanDetails/${loan._id}`)}
            className=" w-fit px-8 my-2 py-2 max-sm:py-1.5 text-sm text-white bg-blue-500 rounded-full hover:bg-blue-600">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;

