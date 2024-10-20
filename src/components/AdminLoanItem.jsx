import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ALLLOANS, APPROVED, PENDING, REJECTED } from "../constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLoanItem = ({ loan, showBtns }) => {
  const [IsApproving, setIsApproving] = useState(false);
  const [IsRejecting, setIsRejecting] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAllLoans = (response) => {
    dispatch({ type: APPROVED, payload: [] });
    dispatch({ type: PENDING, payload: [] });
    dispatch({ type: REJECTED, payload: [] });
    dispatch({ type: ALLLOANS, payload: [] });

    dispatch({ type: ALLLOANS, payload: response.data });
    let approvedLoans = [];
    let pendingLoans = [];
    let rejectedLoans = [];

    response.data.forEach((loan) => {
      if (loan.loanStatus === "approved") {
        approvedLoans.push(loan);
      } else if (loan.loanStatus === "pending") {
        pendingLoans.push(loan);
      } else if (loan.loanStatus === "rejected") {
        rejectedLoans.push(loan);
      }
    });

    dispatch({ type: APPROVED, payload: approvedLoans });
    dispatch({ type: PENDING, payload: pendingLoans });
    dispatch({ type: REJECTED, payload: rejectedLoans });

    console.log("AdminLoanItem", response);
  };

  const getTerms = () => {
    let schedule = [];
    
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
      const nextDate = new Date(new Date().setDate(new Date().getDate()+2));
      nextDate.setDate(nextDate.getDate() + i * frequencyDays);
      repaymentDates.push(nextDate.toDateString());
      if(i===repetitions-1) {
        schedule.push({
          term:i+1,
          amt: Math.ceil(eachAmt +extraAmt),
          dueDate: nextDate,
        });
      }else{
        schedule.push({
          term:i+1,
          amt: Math.floor(eachAmt),
          dueDate: nextDate,
        });
      }
    }
    return schedule;
  };

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      let schedule=getTerms();

      const response = await axios.post(`${process.env.REACT_APP_URL}/loan/approve`,{
        loanId:loan._id,
        schedule
      });

      if (response) {
        fetchAllLoans(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/loan/reject/${loan._id}`
      );
      if (response.status === 200) {
        fetchAllLoans(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div
      onClick={(e) => navigate(`/admin/loanDetails/${loan._id}`)}
      className="text-base shadow rounded-xl border border-gray-300 px-4 py-2 w-full max-w-sm cursor-pointer hover:scale-105 bg-gray-50"
    >
      <div className=" flex gap-2">
        <Avatar
          src={loan.customer.profilePic}
          alt={loan.customer.username}
          style={{ height: "50px", width: "50px" }}
        />
        <div className=" w-full flex items-start justify-between">
          <div className=" flex flex-col items-start">
            <p className="text-base">{loan.customer.username}</p>
            <p className="text-sm font-normal">
              {new Date(loan.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p
            className={`${
              loan.loanStatus === "approved"
                ? " bg-green-500"
                : loan.loanStatus === "rejected"
                ? " bg-red-500"
                : " bg-yellow-500"
            } px-4 text-sm rounded-md text-white py-1.5`}
          >
            {loan.loanStatus}
          </p>
        </div>
      </div>
      <div className=" flex flex-col">
        <p className=" font-normal">
          Loan Amount : <strong> ₹ {loan.amount.toLocaleString()}</strong>
        </p>
        <p className="font-normal">
          Loan Term : <strong> {loan.loanTerm}</strong>
        </p>
        <p className="font-normal">
          Repayment frequency : <strong> {loan.frequency}</strong>
        </p>
        <p className="font-normal">
          {" "}
          Interest (1%) : <strong> {loan.interest.toLocaleString()}</strong>
        </p>
        <p className="font-normal">
          {" "}
          Total Amount with Interest :{" "}
          <strong>
            {" "}
            ₹ {Math.ceil(loan.interest + loan.amount).toLocaleString()}
          </strong>
        </p>
      </div>
      {showBtns && (
        <div className="flex justify-start items-center gap-2 mt-3 mb-2">
          {loan.loanStatus !== "approved" && (
            <button
              className={`px-6 py-1.5 text-sm font-medium text-white rounded-full  ${
                IsApproving
                  ? " bg-green-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
              disabled={IsApproving}
            >
              {IsApproving ? (
                <span className=" flex gap-0.5">
                  <CircularProgress size={16} style={{ color: "white" }} />
                  Approving...
                </span>
              ) : (
                "Approve"
              )}
            </button>
          )}
          {loan.loanStatus !== "rejected" && (
            <button
              className={`px-6 py-1.5 text-sm font-medium text-white rounded-full ${
                IsRejecting ? " bg-red-600" : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setOpen1((prev) => !prev);
              }}
              disabled={IsRejecting}
            >
              {IsRejecting ? (
                <span className=" flex gap-0.5">
                  <CircularProgress size={16} style={{ color: "white" }} />
                  Rejecting...
                </span>
              ) : (
                "Reject"
              )}
            </button>
          )}
        </div>
      )}
      {open && (
        <Dialog
          fullWidth
          open={open}
          onClose={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
        >
          <DialogTitle>Approve</DialogTitle>
          <DialogContent>
            Do you really want to Approve this loan application
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
            >
              Close
            </Button>
            <Button
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
                handleApprove();
              }}
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {open1 && (
        <Dialog
          fullWidth
          open={open1}
          onClose={(e) => {
            e.stopPropagation();
            setOpen1((prev) => !prev);
          }}
        >
          <DialogTitle>Reject</DialogTitle>
          <DialogContent>
            Do you really want to Reject this loan application
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setOpen1((prev) => !prev);
              }}
            >
              Close
            </Button>
            <Button
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setOpen1((prev) => !prev);
                handleReject();
              }}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default AdminLoanItem;
