import { Avatar, CircularProgress, Divider } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminUserprofile = () => {
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/auth/adminUser/${userId}`
      );
      if (response) {
        console.log("AdminUserprofile", response.data);
        setUser(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className=" min-h-screen w-full flex-center">
        <CircularProgress size={30} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-full mx-auto w-full max-w-7xl py-4 px-2">
      <h1 className="text-3xl max-sm:text-xl font-semibold text-start mb-3">
        User Profile
      </h1>
      <div className=" flex max-sm:flex-col gap-4 sm:gap-6">
        <div className=" max-sm:w-full h-full flex flex-col gap-2">
          <div className=" flex-center w-full">
            <div className="relative h-60 w-60 flex-center">
              <Avatar
                src={user?.profilePic}
                className="rounded-full bg-white flex-center"
                alt="image"
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>
          <div className=" flex flex-col gap-1">
            <div className="flex-center flex-col gap-1">
              <p className="text-lg font-medium">{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className=" flex-center flex-col px-2 gap-1 mt-2">
              <p className=" font-medium">
                Gender : <span className="font-normal">{user.gender}</span>{" "}
              </p>
              <p className=" font-medium">
                Mobile No :{" "}
                <span className=" font-normal">+91 {user.phoneNo}</span>{" "}
              </p>
            </div>
          </div>
        </div>
        {/* part2 */}
        <div className=" w-full flex flex-col gap-4">
          <h1 className=" text-xl font-medium">Loan History</h1>
          {user.loan.length > 0 ? (
            <div className=" grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {user.loan.map((loan, i) => (
                <div className="" key={i}>
                  <div className=" flex flex-col">
                    <p className=" font-normal">
                      Loan Amount :{" "}
                      <strong> ₹ {loan.amount.toLocaleString()}</strong>
                    </p>
                    <p className="font-normal">
                      Loan Term : <strong> {loan.loanTerm}</strong>
                    </p>
                    <p className="font-normal">
                      Repayment frequency : <strong> {loan.frequency}</strong>
                    </p>
                    <p className="font-normal">
                      {" "}
                      Interest (1%) :{" "}
                      <strong> {loan.interest.toLocaleString()}</strong>
                    </p>
                    <p className="font-normal">
                      {" "}
                      Total Amount with Interest :{" "}
                      <strong>
                        {" "}
                        ₹{" "}
                        {Math.ceil(
                          loan.interest + loan.amount
                        ).toLocaleString()}
                      </strong>
                    </p>
                    <p className="font-normal">
                      Application Date : 
                      <strong> {new Date(loan.createdAt).toDateString()}</strong>
                    </p>
                    <p
                        className={`${
                        loan.loanStatus === "approved"
                            ? " bg-green-500"
                            : loan.loanStatus === "rejected"
                            ? " bg-red-500"
                            : " bg-yellow-500"
                        } px-4 text-sm rounded-full my-2 w-fit text-white py-1.5`}
                    >
                        {loan.loanStatus}
                    </p>
                    
                  </div>
                  <Divider />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-500">
              No Loan History Found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserprofile;
