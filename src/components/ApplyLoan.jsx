import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ApplyLoan = () => {
  const [initVals, setInitVals] = useState({
    amount: "",
    term: "",
    frequency: "",
  });
  const [initMoney, setInitMoney] = useState({
    eachAmt: 0,
    extraAmt: 0,
    interest: 0,
    dates: [],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const currUser = useSelector((state) => state.reducer.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const amount = Number(initVals.amount);
      if (amount > 10000000) {
        toast.error("Please enter an amount less than 10,000,000");
        return;
      } else if (amount < 50) {
        toast.error("Please enter an amount greater than 50");
        return;
      } else if (!initVals.frequency || !initVals.term) {
        toast.error("Please select both frequency and term");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_URL}/loan/create`,
        {
          customerId: currUser._id,
          amount: Number(initVals.amount),
          loanTerm: initVals.term,
          frequency: initVals.frequency,
          interest: initMoney.interest,
        }
      );

      console.log("response", response);
      toast.success("Loan application submitted successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setInitMoney({ eachAmt: 0, extraAmt: 0, interest: 0, dates: [] });
      setInitVals({ amount: "", term: "", frequency: "", interest: 0 });
    }
  };

  useEffect(() => {
    if (!initVals.amount || !initVals.term || !initVals.frequency) return;

    const termValue = Number(initVals.term.split(" ")[0]);
    const durationType = initVals.term.split(" ")[1];
    let termTime = durationType === "year" ? termValue * 365 : termValue * 30;

    const frequencyDays = {
      weekly: 7,
      "bi-weekly": 14,
      monthly: 30,
    }[initVals.frequency];

    const repetitions = Math.floor(termTime / frequencyDays);
    const interest = (Number(initVals.amount) * (termTime / 365) * 1) / 10;

    const eachAmt = (Number(initVals.amount) + interest) / repetitions;
    const extraAmt = interest - Math.floor(interest);
    let repaymentDates = [];

    for (let i = 0; i < repetitions; i++) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + i * frequencyDays);
      repaymentDates.push(nextDate.toDateString());
    }

    setInitMoney({
      eachAmt: Math.floor(eachAmt),
      extraAmt: extraAmt,
      interest: interest,
      dates: repaymentDates,
    });
  }, [initVals]);

  return (
    <div className="h-full mx-auto w-full max-w-7xl py-4 px-2">
      <h1 className="text-3xl mt-6 max-sm:text-xl underline underline-offset-8 font-semibold text-start">
        Apply for a Loan
      </h1>
      <div className="flex max-sm:flex-col w-full">
        <form
          className="my-5 mt-8 px-4 w-1/2 max-sm:w-full"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-2 md:gap-8">
            <div className="flex flex-col gap-1.5">
              <p className="font-medium m-1">Loan Amount</p>
              <TextField
                id="outlined-basic"
                placeholder="e.g., ₹ 10000"
                fullWidth
                size="small"
                type="number"
                required
                value={initVals.amount}
                onChange={(e) =>
                  setInitVals({ ...initVals, amount: e.target.value })
                }
                className="mt-4"
                style={{ marginBottom: 10 }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="font-medium m-1">Loan Term</p>
              <FormControl fullWidth>
                <InputLabel id="term-select-label">Term</InputLabel>
                <Select
                  labelId="term-select-label"
                  id="term-select"
                  value={initVals.term}
                  label="Term"
                  required
                  onChange={(e) =>
                    setInitVals({ ...initVals, term: e.target.value })
                  }
                  size="small"
                >
                  <MenuItem value="1 month">1 month</MenuItem>
                  <MenuItem value="2 month">2 months</MenuItem>
                  <MenuItem value="3 month">3 months</MenuItem>
                  <MenuItem value="4 month">4 months</MenuItem>
                  <MenuItem value="5 month">5 months</MenuItem>
                  <MenuItem value="6 month">6 months</MenuItem>
                  <MenuItem value="1 year">1 year</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-medium m-1">Repayment Frequency</p>
              <FormControl fullWidth>
                <InputLabel id="frequency-select-label">Frequency</InputLabel>
                <Select
                  labelId="frequency-select-label"
                  id="frequency-select"
                  value={initVals.frequency}
                  label="Frequency"
                  required
                  onChange={(e) =>
                    setInitVals({ ...initVals, frequency: e.target.value })
                  }
                  size="small"
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="bi-weekly">Bi-weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="flex flex-col gap-1 max-sm:mt-6 mt-2">
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                className="w-full mt-8"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress /> : "Apply Now"}
              </Button>
              <p className="mt-2 flex-center cursor-pointer hover:text-red-500">
                Need help?
              </p>
            </div>
          </div>
        </form>

        <div className="mt-8 w-1/2 max-sm:w-full">
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border px-6 py-4 border-gray-100">
            <h1 className="text-xl font-bold mb-4">Loan Details</h1>
            <p className="text-3xl font-semibold text-gray-800 mb-2">
              ₹ {Number(initVals.amount).toLocaleString()}
            </p>
            <p className="my-3 text-lg text-gray-800 mb-4">
              Loan Term: <strong>{initVals.term}</strong>
            </p>
            <p className="my-3 text-lg text-gray-800 mb-4">
              Repayment Frequency: <strong>{initVals.frequency}</strong>
            </p>

            {initVals.amount && initVals.term && initVals.frequency && (
              <div className="flex flex-col gap-2">
                <p>
                  Interest (1%):{" "}
                  <strong> ₹ {Math.floor(initMoney.interest)}</strong>
                </p>
                <h2 className="font-semibold text-lg mb-2">
                  Repayment Schedule (if loan approved)
                </h2>
                <div className="grid grid-cols-2 gap-1.5 text-gray-700">
                  {initMoney.dates.map((date, i) => (
                    <div className="flex gap-2" key={i}>
                      <p>{date} - </p>
                      <strong>
                        {i === initMoney.dates.length - 1
                          ? "₹"+ Math.ceil(initMoney.eachAmt + initMoney.extraAmt)
                          : "₹"+ Math.floor(initMoney.eachAmt)}
                      </strong>
                    </div>
                  ))}
                </div>
                <p className="text-[17px] mt-4">
                  Total Amount with Interest : {" "}
                  <strong>
                    ₹{" "}
                    {Math.ceil(
                      Number(initVals.amount) + initMoney.interest
                    ).toLocaleString()}
                  </strong>
                </p>
              </div>
            )}

            <button
              className="text-sm font-medium mt-6 text-white bg-yellow-500 py-2 px-8 rounded-full"
              onClick={(e) => e.preventDefault()}
            >
              Pending
            </button>
          </div>
          <p className="mt-2 cursor-pointer hover:text-red-500 flex-center">
            Need help?
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;
