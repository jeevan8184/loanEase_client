import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  MdCancel,
  MdMonetizationOn,
  MdOutlineMonetizationOn,
  MdPending,
  MdThumbUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import LoanCard from "./LoanCard";
import PaymentCard from "./Paymentcard";

const CustomerHome = () => {
  const [allLoans, setAllLoans] = useState([]);
  const [loanVals, setLoanVals] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const currUser = useSelector((state) => state.reducer.user);

  useEffect(() => {
    const fetchAllLoans = async () => {
      try {
        setLoanVals({ total: 0, approved: 0, pending: 0, rejected: 0 });
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/auth/adminUser/${currUser._id}`
        );
        if (response) {
          setAllLoans(response.data.loan);
          console.log("CustomerHome", response.data);
          let approved = 0;
          let pending = 0;
          let rejected = 0;
          response.data.loan.forEach((loan) => {
            if (loan.loanStatus === "approved") approved += 1;
            else if (loan.loanStatus === "pending") pending += 1;
            else if (loan.loanStatus === "rejected") rejected += 1;
          });
          setLoanVals({
            total: response.data.loan.length,
            approved: approved,
            pending: pending,
            rejected: rejected,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currUser) {
      fetchAllLoans();
    }
  }, [currUser]);

  const metrics = [
    {
      label: "Total Loans",
      value: loanVals.total,
      icon: <MdMonetizationOn size={28} />,
      bgColor: "#f5f5f5",
    },
    {
      label: "Approved Loans",
      value: loanVals.approved,
      icon: <MdThumbUp size={28} />,
      bgColor: "#e0f7fa",
    },
    {
      label: "Pending Loans",
      value: loanVals.pending,
      icon: <MdPending size={28} />,
      bgColor: "#fff8e1",
    },
    {
      label: "Rejected Loans",
      value: loanVals.rejected,
      icon: <MdCancel size={28} />,
      bgColor: "#ffebee",
    },
    {
      label: "Total Repaid Amount",
      value: "$100,000",
      icon: <MdMonetizationOn size={28} />,
      bgColor: "#f1f8e9",
    },
    {
      label: "Total Outstanding Amount",
      value: "$20,000",
      icon: <MdOutlineMonetizationOn size={28} />,
      bgColor: "#b0d6c6",
    },
  ];

  const getPayingLoans = (allLoans) => {
    const today = new Date();

    const start = new Date(today.setDate(today.getDate() - today.getDay()));
    start.setHours(0, 0, 0, 0);
    const end = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    end.setHours(23, 59, 59, 999);
  
    const filterLoans = allLoans.filter(loan => {
      return loan.loanStatus==="approved" &&  loan.schedule.some(scheduleItem => {
        const dueDate = new Date(scheduleItem.dueDate);
        return dueDate >= start && dueDate <= end && (scheduleItem.status === 'pending' || scheduleItem.status ==='overdue');
      });
    });
  
    return filterLoans;
  };

  const approvedLoans=allLoans.filter((loan) => loan.loanStatus === "approved" &&
      new Date(loan.approvedAt) >= new Date(new Date().setDate(new Date().getDate() - 7))
  );

  const rejectedLoans =allLoans.filter((loan) =>loan.loanStatus === "rejected" &&
      new Date(loan.approvedAt) >= new Date(new Date().setDate(new Date().getDate() - 7))
  );

  return (
    <div className="">
      <div className=" flex flex-col gap-1">
        <h1 className=" text-2xl max-sm:text-xl font-medium mb-2">
          Your Loan details
        </h1>
        <div className=" grid grid-cols-3 max-sm:grid-cols-2">
          {metrics.map((metric, index) => (
            <div key={index} className=" w-full p-2 sm:p-3">
              <div
                className="flex gap-2 flex-col items-center hover:scale-105 justify-center h-28  rounded-xl shadow-md"
                style={{ backgroundColor: metric.bgColor }}
              >
                <div className=" text-lg">{metric.label}</div>
                <div className="flex items-center justify-center">
                  {metric.icon}
                  <span className="ml-2 text-xl">{metric.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className=" flex flex-col gap-6">
        <h1 className=" text-2xl max-sm:text-xl font-medium">
          Recent Loan Activity
        </h1>
        <div className=" flex flex-col gap-2">
          <h2 className=" text-lg font-medium">Recently Approved loans</h2>
          <div className=" grid xl:grid-cols-3 sm:grid-cols-2 gap-4 max-sm:grid-cols-1">
            {allLoans
              .filter(
                (loan) =>
                  loan.loanStatus === "approved" &&
                  new Date(loan.approvedAt) >= new Date(new Date().setDate(new Date().getDate() - 7))
              )
              .map((loan, i) => (
                <LoanCard loan={loan} key={i} />
              ))}
          </div>
          {approvedLoans.length === 0 && (
            <p className=" text-xl ml-6 text-gray-500">There is no recently approved loans</p>
          )}
        </div>
        <div className=" flex flex-col gap-2">
          <h2 className=" text-lg font-medium">Recently Rejected loans</h2>
          <div className=" grid xl:grid-cols-3 sm:grid-cols-2 gap-4 max-sm:grid-cols-1">
            {allLoans
              .filter(
                (loan) =>
                  loan.loanStatus === "rejected" &&
                  new Date(loan.approvedAt) >= new Date(new Date().setDate(new Date().getDate() - 7))
              )
              .map((loan, i) => (
                <LoanCard loan={loan} key={i} />
              ))}
          </div>
          {rejectedLoans.length === 0 && (
            <p className=" text-xl ml-6 text-gray-500">There is no recently rejected loans</p>
          )}
        </div>
        <div className=" flex flex-col gap-3">
          <h2 className=" text-lg font-medium">Payment Due Loans</h2>
          <div className=" grid xl:grid-cols-3 sm:grid-cols-2 gap-4 max-sm:grid-cols-1">
            {getPayingLoans(allLoans).map((loan, i) => (
                <PaymentCard loan={loan} key={i} />
            ))}
          </div>
          {getPayingLoans(allLoans).length === 0 && (
            <p className=" text-xl ml-6 text-gray-500">There is no due payment loans</p>
          )}
        </div> 
      </div>
    </div>
  );
};

export default CustomerHome;


