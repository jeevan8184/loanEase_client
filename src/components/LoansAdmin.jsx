import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, CircularProgress, Tab, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import LoanCard from './LoanCard';
import { useNavigate } from 'react-router-dom';
import AdminLoanItem from './AdminLoanItem';
import { ALLLOANS, APPROVED, PENDING, REJECTED } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from './SearchBar';

const LoansAdmin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState('all');
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const state=useSelector((state)=> state.reducer);
    const allLoans=state.allLoans;
    const approved=state.approved;
    const pending=state.pending;
    const rejected=state.rejected;
    
    console.log("state",state);

    useEffect(() => {
      const fetchAllLoans = async () => {
        dispatch({ type: APPROVED, payload: [] });
        dispatch({ type: PENDING, payload: [] });
        dispatch({ type: REJECTED, payload: [] });
        dispatch({ type: ALLLOANS, payload: [] });
        try {
          setIsLoading(true);
          const response = await axios.get(
            `${process.env.REACT_APP_URL}/loan/getAllLoans`
          );
          if (response) {
            dispatch({ type: ALLLOANS, payload:response.data });
            console.log("Loans Admin", response.data);
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
          }
        } catch (error) {
          console.log(error);
        }finally{
          setIsLoading(false);
        }
      };
      fetchAllLoans();
    }, []);

    if (isLoading) {
        return (
          <div className=" min-h-screen w-full flex-center">
            <CircularProgress size={30} />
          </div>
        );
      }

  return (
    <div className='h-full mx-auto w-full max-w-7xl py-4 px-2'>
      <div className=''>
        {/* <h1 className='text-3xl font-semibold'>Search Bar</h1> */}
        <SearchBar />
      </div>
      <div className=' my-2'>
      <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", overflowX: 'auto' }}>
              <TabList
                onChange={(e,value)=> setValue(value)}
                aria-label="lab API tabs example"
                scrollButtons
              >
                <Tab label="all " style={{textTransform:"capitalize",fontSize:"1rem"}} value="all" />
                <Tab label="approved " style={{textTransform:"capitalize",fontSize:"1rem"}} value="approved" />
                <Tab label="pending " style={{textTransform:"capitalize",fontSize:"1rem"}} value="pending" />
                <Tab label="rejected " style={{textTransform:"capitalize",fontSize:"1rem"}} value="rejected" />
              </TabList>
            </Box>
            <TabPanel value="all">
              <div className="grid grid-cols-3 w-full max-lg:grid-cols-2 gap-3 max-sm:grid-cols-1">
                {allLoans?.length>0 && allLoans?.map((loan,i)=> (
                  <AdminLoanItem loan={loan} showBtns={true} />
                ))}
                {allLoans?.length===0 && (
                  <div className=" mt-12 flex flex-col gap-1 items-center">
                    <Typography variant="h4" className="text-center">No loans found</Typography>
                    <Typography variant="h6" className="text-center">There are no loan </Typography>
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel value="approved">
              <div className="grid grid-cols-3 w-full max-lg:grid-cols-2 gap-3 max-sm:grid-cols-1">
                {approved?.map((loan,i)=> (
                  <AdminLoanItem loan={loan} showBtns={true}/>
                ))}
                {approved?.length===0 && (
                    <div className=" mt-12 flex flex-col gap-1 items-center">
                      <Typography variant="h4" className="text-center">No loans found</Typography>
                        <Typography variant="h6" className="text-center">There is no loan approved</Typography>
                    </div>
                  )}
              </div>
            </TabPanel>
            <TabPanel value="pending">
              <div className="grid grid-cols-3 w-full max-lg:grid-cols-2 gap-3 max-sm:grid-cols-1">
                {pending?.map((loan,i)=> (
                  <AdminLoanItem loan={loan} showBtns={true} />
                ))}
                {pending?.length===0 && (
                    <div className=" mt-12 flex flex-col gap-1 items-center">
                      <Typography variant="h4" className="text-center">No loans found</Typography>
                        <Typography variant="h6" className="text-center">There is no loan pending</Typography>
                    </div>
                  )}
              </div>
            </TabPanel>
            <TabPanel value="rejected">
              <div className="grid grid-cols-3 w-full max-lg:grid-cols-2 gap-3 max-sm:grid-cols-1">
                {rejected?.map((loan,i)=> (
                  <AdminLoanItem loan={loan} showBtns={true} />
                ))}
                {rejected?.length===0 && (
                    <div className=" mt-12 flex-center flex flex-col gap-1">
                      <Typography variant="h4" className="text-center">No loans found</Typography>
                        <Typography variant="h6" className="text-center">There is no loan rejected</Typography>
                    </div>
                  )}
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </div>
  )
}

export default LoansAdmin

