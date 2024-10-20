import {
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  MdCancel,
  MdMonetizationOn,
  MdOutlineMonetizationOn,
  MdPending,
  MdThumbUp,
} from "react-icons/md";
import GetRecent from "./GetRecent";

const Dashboard = () => {
  const [allLoans, setAllLoans] = useState([]);
  const [loanVals, setLoanVals] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllLoans = async () => {
      try {
        setLoanVals({ total: 0, approved: 0, pending: 0, rejected: 0 });
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/loan/getAllLoans`
        );
        if (response) {
          setAllLoans(response.data);
          console.log("All loans", response.data);
          let approved = 0;
          let pending = 0;
          let rejected = 0;
          response.data.forEach((loan) => {
            if (loan.loanStatus === "approved") approved += 1;
            else if (loan.loanStatus === "pending") pending += 1;
            else if (loan.loanStatus === "rejected") rejected += 1;
          });
          setLoanVals({
            total: response.data.length,
            approved: approved,
            pending: pending,
            rejected: rejected,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllLoans();
  }, []);

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
      bgColor: "#fffde7",
    },
  ];

  if (isLoading) {
    return (
      <div className=" min-h-screen w-full flex-center">
        <CircularProgress size={30} />
      </div>
    );
  }

  return (
    <div className=" flex flex-col gap-2 px-2">
      <h1 className=" text-2xl max-sm:text-xl font-medium mt-4">
        Admin Dashboard
      </h1>
      <div className=" flex flex-col gap-2">
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
        <GetRecent allLoans={allLoans} />
      </div>
    </div>
  );
};

export default Dashboard;
