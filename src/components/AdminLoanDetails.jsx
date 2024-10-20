import { Avatar, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminLoanDetails = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [IsApproving, setIsApproving] = useState(false);
  const [IsRejecting, setIsRejecting] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const fetchLoan = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/loan/getAdminLoan/${loanId}`
      );
      if (response) {
        console.log("AdminLoanDetails", response);
        setLoan(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loanId) {
      fetchLoan();
    }
  }, [loanId]);

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
        fetchLoan();
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
      if(response) {
        fetchLoan();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRejecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className=" min-h-screen w-full flex-center">
        <CircularProgress size={30} />
      </div>
    );
  }

  if (!loan) return null;

  return (
    <div className="h-full mx-auto w-full max-w-7xl py-4 px-2">
      <h1 className="text-3xl max-sm:text-xl font-semibold text-start mb-3">
        Loan Details
      </h1>
      <div className="grid grid-cols-3 max-sm:grid-cols-1 max-lg:grid-cols-2 gap-4 sm:gap-6">
        {/* part1 */}

        <div className=" w-full h-full flex flex-col gap-2">
          <div className=" flex-center w-full">
            <div className="relative h-60 w-60 flex-center">
              <Avatar
                src={loan.customer?.profilePic}
                className="rounded-full bg-white flex-center"
                alt="image"
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>
          <div className=" flex flex-col gap-1">
            <div className="flex-center flex-col gap-1">
              <p className="text-lg font-medium">{loan.customer?.username}</p>
              <p className="text-sm text-gray-500">{loan.customer?.email}</p>
            </div>
            <div className=" flex-center flex-col px-2 gap-1 mt-2">
              <p className=" font-medium">
                Gender :{" "}
                <span className="font-normal">{loan.customer.gender}</span>{" "}
              </p>
              <p className=" font-medium">
                Mobile No :{" "}
                <span className=" font-normal">
                  +91 {loan.customer.phoneNo}
                </span>{" "}
              </p>
            </div>
          </div>
        </div>

        {/* part2 */}

        <div className="">
          <div className="  bg-white shadow-lg rounded-lg overflow-hidden border px-6 py-4 border-gray-200">
            <h1 className="text-2xl max-sm:text-xl font-medium mb-4">Loan Details</h1>
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
              className={` my-2 flex-center px-6 text-white py-1.5 rounded-md ${
                loan.loanStatus === "pending"
                  ? "bg-yellow-500"
                  : loan.loanStatus === "approved"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {loan.loanStatus}
            </span>
          </div>
        </div>

        {/* part3 */}

        {loan.loanStatus === "approved" && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border px-6 py-4 border-gray-200">
            <h1 className="text-2xl max-sm:text-xl font-medium mb-4">Repayment History</h1>
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

      <div className=" mt-4">
        <div className="flex justify-start items-center gap-2 mt-3 mb-2">
          {loan.loanStatus !=="approved" && (
            <button
              className={`px-10  max-sm:w-full py-2.5 text-sm font-medium text-white rounded-full  ${
                IsApproving ? " bg-green-600" : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={()=> setOpen((prev)=> !prev)}
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
          {loan.loanStatus !=="rejected" && (
            <button
              className={`px-10 max-sm:w-full py-2.5 text-sm font-medium text-white rounded-full ${
                IsRejecting ? " bg-red-600" : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={()=> setOpen1((prev)=> !prev)}
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
        {open && (
            <Dialog fullWidth open={open} onClose={() => setOpen((prev)=> !prev)}>
            <DialogTitle>Approve</DialogTitle>
            <DialogContent>
                Do you really want to Approve this loan application
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen((prev)=> !prev) }>Close</Button>
                <Button color="success" onClick={()=> {
                setOpen((prev)=> !prev);
                loan && handleApprove();
                }}>Approve</Button>
            </DialogActions>
            </Dialog>
        )}
        {open1 && (
            <Dialog fullWidth open={open1} onClose={() => setOpen1((prev)=> !prev)}>
            <DialogTitle>Reject</DialogTitle>
            <DialogContent>
                Do you really want to Reject this loan application
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen1((prev)=> !prev) }>Close</Button>
                <Button color="error" onClick={()=> {
                setOpen1((prev)=>!prev);
                handleReject();
                }}>Reject</Button>
            </DialogActions>
            </Dialog>
        )}
      </div>

    </div>
  );
};

export default AdminLoanDetails;


