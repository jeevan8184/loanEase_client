import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { MdAccountBalance } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyAdmin = () => {
  const [textotp, setTextotp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate=useNavigate();

  console.log("location", location);

  const handleVerify = () => {
    setIsLoading(true);
    if (!textotp) {
      toast.error("enter opt");
      return;
    }
    if (textotp === location.state.otp) {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      toast.error("wrong opt");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex-center">
      <div className="mt-24 bg-gray-100 rounded-xl shadow-md px-10 py-12 max-w-xl w-full">
        <div className="flex-center gap-2">
          <MdAccountBalance
            className="text-green-600 hover:text-blue-600 transition duration-300 ease-in-out shadow-lg"
            size={45}
            style={{
              padding: "10px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
            }}
          />
          <h1 className="text-center text-3xl font-bold text-gray-800">
            LoanEase
          </h1>
        </div>
        <p className=" mb-3 mt-2 font-medium text-center">
          Welcome to LoanEase
        </p>
        <p className=" font-semibold text-[17px] mb-2">Verification</p>
        <p className="">Enter your otp sent to your mail for verification</p>
        <p className="font-medium m-1 mt-6">OTP</p>
        <TextField
          id="outlined-basic"
          fullWidth
          required
          size="small"
          value={textotp}
          onChange={(e) => setTextotp(e.target.value)}
          className="mt-4"
          style={{ marginBottom: 10, height: "50px" }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="mt-10"
          style={{ marginTop: 13 }}
          onClick={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : "submit"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyAdmin;
