import {
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const LoanDetails = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [isLoaading, setIsLoaading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [initMoney, setInitMoney] = useState({
    eachAmt: 0,
    extraAmt: 0,
    interest: 0,
    dates: [],
  });
  const [params]=useSearchParams();

  const verifySession=async(session_id)=>{

    try {
      const response=await axios.get(`${process.env.REACT_APP_URL}/loan/verify/${session_id}`);
      if(response.data.status==="paid") {
        return true;
      }else return false;
      
    } catch (error) {
      console.log(error);
    }
  }

  const updateFunction=async(term,loanId)=>{

    try {
      const response=await axios.post(`${process.env.REACT_APP_URL}/loan/update`,{
        term:term,
        loanId:loanId
      });
      if(response) {
        console.log("Updated loan",response.data);
        setLoan(response.data);
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    if(params.get("session_id")) {
      setIsLoading(true);
      if(verifySession(params.get("session_id")) && loanId) {
        updateFunction(params.get("term"),loanId);
      }
      setIsLoading(false);
    }
  },[params]);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        setIsLoaading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/loan/getLoan/${loanId}`
        );
        if (response) {
          setLoan(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoaading(false);
      }
    };
    if (loanId) {
      fetchLoan();
    }
  }, [loanId]);

  useEffect(() => {
    if(loan) {
        const termValue = Number(loan.loanTerm.split(" ")[0]);
        const durationType = loan.loanTerm.split(" ")[1];
        let termTime = durationType === "year" ? termValue * 365 : termValue * 30;

        const frequencyDays = {
        weekly: 7,
        "bi-weekly": 14,
        monthly: 30,
        }[loan.frequency];

        const repetitions = Math.floor(termTime / frequencyDays);
        const interest = (Number(loan.amount) * (termTime / 365) * 1) / 10;

        const eachAmt = (Number(loan.amount) + interest) / repetitions;
        const extraAmt = interest - Math.floor(interest);
        let repaymentDates = [];

        for (let i = 0; i < repetitions; i++) {
        const nextDate = new Date(new Date());
        nextDate.setDate(nextDate.getDate() + i * frequencyDays);
        repaymentDates.push(nextDate.toDateString());
        }

        setInitMoney({
        eachAmt: Math.floor(eachAmt),
        extraAmt: extraAmt,
        interest: interest,
        dates: repaymentDates,
        });
    }
  }, [loan]);

  
  const getTerm = (loan) => {
    const today = new Date();

    const start = new Date(today.setDate(today.getDate() - today.getDay()));
    start.setHours(0, 0, 0, 0);
    const end = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    end.setHours(23, 59, 59, 999);

    const lonTerm = loan.schedule.filter((item) => {
      const dueDate = new Date(item.dueDate);
      return (
        dueDate >= start &&
        dueDate <= end &&
        (item.status === "pending" || item.status === "overdue")
      );
    });
    return lonTerm[0];
  };

  const handlePayment = async () => {
    try {
      console.log("hello");
      const response = await axios.post(`${process.env.REACT_APP_URL}/loan/checkOut`,{
        amt:Number(getTerm(loan).amt),
        loanId:loan._id,
        termId:getTerm(loan).term
      });
      if (response) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoaading || isLoading) {
    return (
      <div className=" min-h-screen w-full flex-center">
        <CircularProgress size={30} />
      </div>
    );
  }

  if (!loan) return null;

  return (
    <div className="h-full mx-auto w-full max-w-7xl py-4 px-2">
      <h1 className="text-3xl max-sm:text-xl font-semibold text-start">
        Your Loan Details
      </h1>
      <div className=" grid grid-cols-2 max-sm:grid-cols-1 w-full my-4 gap-4 sm:gap-6">
        <div className="">
          <div className="  bg-white shadow-lg rounded-lg overflow-hidden border px-6 py-4 border-gray-200">
            <h1 className="text-2xl max-sm:text-xl font-semibold mb-4">Loan Details</h1>
            <p className="text-3xl font-medium text-gray-800 mb-2">
              ₹ {Number(loan.amount).toLocaleString()}
            </p>
            <p className="my-3 text-lg text-gray-800 mb-4">
              Loan Term : <strong> {loan.loanTerm}</strong>
            </p>
            <p className="my-3 text-lg text-gray-800 mb-4">
              Repayment Frequency : <strong> {loan.frequency}</strong>
            </p>
            <p className="my-3 text-lg text-gray-800 mb-4">
              Interest (1%) :<strong> ₹ {Math.floor(loan.interest)}</strong>
            </p>
            <p className="my-3 text-lg text-gray-800 mb-4">
              Total amount with interest :
              <strong> ₹ {Math.floor(loan.amount).toLocaleString()}</strong>
            </p>
            <p className="my-3 text-lg text-gray-800 mb-4">
              Loan Date :{" "}
              <strong> {new Date(loan.loanDate).toLocaleDateString()}</strong>
            </p>
            <span
              className={` my-2 flex-center px-6 text-white py-1.5 rounded-xl ${
                loan.loanStatus === "pending"
                  ? "bg-yellow-500"
                  : loan.loanStatus === "approved"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {loan.loanStatus}
            </span>
            {loan.loanStatus === "approved" && getTerm(loan) && getTerm(loan)?.status !=="paid" && (
              <button
                className="bg-blue-500 w-full hover:bg-blue-600 text-white px-5 py-1.5 rounded-lg"
                onClick={handlePayment}
              >
                Pay Now
              </button>
            ) }
          </div>
        </div>

        {/* part-2*/}

        {(loan.loanStatus === "pending" || loan.loanStatus === "rejected") && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border px-6 py-4 border-gray-200">
            <h1 className="text-2xl max-sm:text-xl font-medium mb-4">Repayment Schedule (if approved)</h1>
            <div className=" grid grid-cols-2 gap-4">
                {initMoney.dates.map((date,i)=> (
                    <div className="flex gap-3" key={i}>
                        <p className="">{date} - </p>
                        <span className=" font-semibold">
                        {i === initMoney.dates.length - 1
                            ? " ₹ " +Math.ceil(initMoney.eachAmt + initMoney.extraAmt)
                            : " ₹ " +Math.floor(initMoney.eachAmt)}
                        </span>
                  </div>
                ))}
            </div>
        </div>
        )}

        {loan.loanStatus ==="approved" && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border px-6 py-4 border-gray-200">
            <h1 className="text-2xl max-sm:text-xl font-medium mb-4">Repayment Schedule</h1>
            <div className=" grid grid-cols-1 gap-2">
                {loan.schedule.map((item,i)=> (
                    <div className="flex gap-3 items-center w-full" key={i}>
                        <p className="">{new Date(item.dueDate).toDateString()} - </p>
                        <span className=" font-semibold">{item.amt}</span>
                        <span
                          className={` text-white px-6 py-1.5 rounded-xl text-sm ${
                            item.status === "pending"
                              ? "bg-yellow-500"
                              : item.status === "paid"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {item.status}
                        </span>
                  </div>
                ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default LoanDetails;


