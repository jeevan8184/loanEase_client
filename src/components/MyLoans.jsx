import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import LoanCard from "./LoanCard";

const MyLoans = () => {
  const navigate = useNavigate();
  const currUser = useSelector((state) => state.reducer.user);
  const [value, setValue] = useState("all");
  const [allLoans, setAllLoans] = useState([]);
  const [approved, setApproved] = useState([]);
  const [pending, setPending] = useState([]);
  const [rejected, setRejected] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      setAllLoans([]);
      setApproved([]);
      setPending([]);
      setRejected([]);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/loan/get/${currUser._id}`
        );

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
        setAllLoans(response.data);
        setApproved(approvedLoans);
        setPending(pendingLoans);
        setRejected(rejectedLoans);
      } catch (error) {
        console.log(error);
      }
    };
    if (currUser) {
      fetchLoans();
    }
  }, [currUser]);

  return (
    <div className="h-full mx-auto w-full max-w-7xl py-4 px-2">
      <h1 className="text-3xl max-sm:text-xl font-semibold text-start">
        My Loans
      </h1>
      <div className=" my-2">
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                overflowX: "auto",
              }}
            >
              <TabList
                onChange={(e, value) => setValue(value)}
                aria-label="lab API tabs example"
                scrollButtons
              >
                <Tab
                  label="all "
                  style={{ textTransform: "capitalize", fontSize: "1rem" }}
                  value="all"
                />
                <Tab
                  label="approved "
                  style={{ textTransform: "capitalize", fontSize: "1rem" }}
                  value="approved"
                />
                <Tab
                  label="pending "
                  style={{ textTransform: "capitalize", fontSize: "1rem" }}
                  value="pending"
                />
                <Tab
                  label="rejected "
                  style={{ textTransform: "capitalize", fontSize: "1rem" }}
                  value="rejected"
                />
              </TabList>
            </Box>
            <TabPanel value="all">
              <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-4 max-sm:grid-cols-1">
                {allLoans.length > 0 &&
                  allLoans.map((loan, i) => <LoanCard loan={loan} />)}
                {allLoans.length === 0 && (
                  <div className=" mt-5 flex flex-col gap-1 items-center">
                    <Typography variant="h4" className="text-center">
                      No loans found
                    </Typography>
                    <button
                      className=" mt-3  max-w-sm inline-block bg-[#00A8E8] text-white text-lg px-6 py-2 rounded-lg shadow-lg hover:bg-[#007BB5] transition duration-300 ease-in-out"
                      onClick={() => navigate("/applyLoan")}
                    >
                      Apply for a loan
                    </button>
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel value="approved">
              <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-4 max-sm:grid-cols-1">
                {approved.map((loan, i) => (
                  <LoanCard loan={loan} />
                ))}
                {approved.length === 0 && (
                  <div className=" mt-5 flex flex-col gap-1 items-center">
                    <Typography variant="h4" className="text-center">
                      No loans found
                    </Typography>
                    <button
                      className=" mt-3  max-w-sm inline-block bg-[#00A8E8] text-white text-lg px-6 py-2 rounded-lg shadow-lg hover:bg-[#007BB5] transition duration-300 ease-in-out"
                      onClick={() => navigate("/applyLoan")}
                    >
                      Apply for a loan
                    </button>
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel value="pending">
              <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-4 max-sm:grid-cols-1">
                {pending.map((loan, i) => (
                  <LoanCard loan={loan} />
                ))}
                {pending.length === 0 && (
                  <div className=" mt-5 flex flex-col gap-1 items-center">
                    <Typography variant="h4" className="text-center">
                      No loans found
                    </Typography>
                    <button
                      className=" mt-3  max-w-sm inline-block bg-[#00A8E8] text-white text-lg px-6 py-2 rounded-lg shadow-lg hover:bg-[#007BB5] transition duration-300 ease-in-out"
                      onClick={() => navigate("/applyLoan")}
                    >
                      Apply for a loan
                    </button>
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel value="rejected">
              <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-4 max-sm:grid-cols-1">
                {rejected.map((loan, i) => (
                  <LoanCard loan={loan} />
                ))}
                {rejected.length === 0 && (
                  <div className=" mt-5 flex-center flex flex-col gap-1">
                    <Typography variant="h4" className="text-center">
                      No loans found
                    </Typography>
                    <button
                      className=" mt-3  max-w-sm inline-block bg-[#00A8E8] text-white text-lg px-6 py-2 rounded-lg shadow-lg hover:bg-[#007BB5] transition duration-300 ease-in-out"
                      onClick={() => navigate("/applyLoan")}
                    >
                      Apply for a loan
                    </button>
                  </div>
                )}
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  );
};

export default MyLoans;
