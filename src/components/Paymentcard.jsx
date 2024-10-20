import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentCard = ({ loan }) => {
  const navigate = useNavigate();

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

  console.log("term", getTerm(loan));

  return (
    <div className="loan-card flex flex-col bg-white shadow-lg rounded-lg p-4 mb-4 border">
      <div className="  px-4 py-3">
        <p className=" text-end">
          <strong className=" text-amber-500">Due : </strong>{" "}
          {new Date(getTerm(loan).dueDate).toDateString()}
        </p>
        <div className=" flex flex-col gap-1">
          <p className="">
            <strong> Loan Amount : </strong> ₹ {loan.amount.toLocaleString()}
          </p>
          <p className="">
            <strong> Loan Term : </strong> {loan.loanTerm}
          </p>
          <p className="">
            <strong> Repayment frequency : </strong> {loan.frequency}
          </p>
          <p className="">
            <strong> Interest (1%) : </strong> {loan.interest.toLocaleString()}
          </p>
          <p className="">
            <strong> Total Amount with Interest :</strong> ₹{" "}
            {Math.ceil(loan.interest + loan.amount).toLocaleString()}
          </p>
          <p className=" text-amber-500">
            <strong> Due Amount : </strong> ₹ {getTerm(loan).amt}
          </p>
        </div>
        <div className="action-buttons flex gap-2 mt-3">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-1.5 rounded-lg"
            onClick={handlePayment}
          >
            Pay Now
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-1.5 rounded-lg"
            onClick={() => navigate(`/loanDetails/${loan._id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
