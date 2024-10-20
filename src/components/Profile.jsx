import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";

const Profile = () => {
  const navigate = useNavigate();
  const currUser = useSelector((state) => state.reducer.user);
  const [open, setOpen] = useState(false);
  
  if(!currUser) return null;

  return (
    <div className="h-full mx-auto w-full max-w-7xl py-4 px-2">
      <div className=" grid grid-cols-2 max-sm:grid-cols-1 gap-4 sm:gap-6">
        <div className=" w-full h-full flex flex-col gap-2">
          <div className=" flex-center w-full">
            <div className="relative h-60 w-60 flex-center">
              <Avatar
                src={currUser?.profilePic}
                className="rounded-full bg-white flex-center"
                alt="image"
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>
          <div className=" flex flex-col gap-1">
            <div className="flex-center flex-col gap-1">
              <p className="text-lg font-medium">{currUser?.username}</p>
              <p className="text-sm text-gray-500">{currUser?.email}</p>
            </div>
            <div className=" flex-center flex-col px-2 gap-1 mt-2">
              <p className=" font-medium">Gender : <span className="font-normal">{currUser.gender}</span>  </p>
              <p className=" font-medium">Mobile No : <span className=" font-normal">+91 {currUser.phoneNo}</span>  </p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className=" cursor-pointer" onClick={()=> navigate(`/resetpass?email=${currUser.email}`)}>
            <p className=" text-[17px] font-medium  px-6 py-4 hover:bg-gray-100">change password</p>
            <Divider  />
          </div>
          <div className=" cursor-pointer" onClick={()=> setOpen((prev)=>!prev)}>
            <p className=" text-[17px] font-medium  px-6 py-4 hover:bg-red-50 text-red-500">Logout</p>
            <Divider  />
          </div>
          <div>
            <p className=" text-[17px] font-medium  px-6 py-4 hover:bg-gray-100">Total Loans : <span className=" font-normal">{currUser.myLoans.length}</span> </p>
            <Divider  />
          </div>
        </div>
      </div>
      {open && (
        <Dialog fullWidth open={open} onClose={() => setOpen((prev)=> !prev)}>
          <DialogTitle>Logout</DialogTitle>
          <DialogContent>
            Do you really want to logout
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen((prev)=> !prev) }>Close</Button>
            <Button color="error" onClick={() =>{
              localStorage.removeItem('token');
              navigate('/login');
              setOpen((prev)=> !prev);
            } }>logout</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Profile;



