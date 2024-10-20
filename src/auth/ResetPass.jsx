import { Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  MdAccountBalance,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";


const ResetPass = () => {
  const [email, setEmail] = useState("");
  const emailMatch = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const navigate = useNavigate();
  const [params]=useSearchParams();
  const [initVals, setInitVals] = useState({
    form1: true,
    form2: false,
    form3: false,
  });
  const [initPass, setInitPass] = useState({password:"",cpassword:""});
  const [textotp, setTextotp] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  let newText = "";

  useEffect(()=> {
    if(params.get("email")) {
      setEmail(params.get("email"));
    }
  },[params]);

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!emailMatch.test(email)) {
      toast.error("Invalid Email");
      return;
    }
    newText="";
    for (let i = 0; i < 6; i++) {
      const char = Math.floor(Math.random() * 10);
      newText += char.toString();
    }
    setOtp(newText);

    try {
      setIsLoading2(true);
      const checkMail=await axios.get(`${process.env.REACT_APP_URL}/auth/checkMail?email=${email}`);
      if(checkMail.data.error) {
        toast.error(checkMail.data.error);
        return;
      }
      const response=await axios.post(`${process.env.REACT_APP_URL}/auth/sendMail`,{
        email: email,
        msg: `Your one time password is ${newText}`,
      });

      if(response) {
        toast.success(response.data.message+" : "+newText);
        setInitVals({ form1: false, form2: true, form3: false });
      }

    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading2(false);
    }
  };

  const handleVerify = () => {
    setIsLoading(true);
    if (!textotp) {
      toast.error("enter opt");
      return;
    }
    if(textotp===otp) {
        setTimeout(()=> {
            setInitVals({ form1: false, form2: false, form3: true });
        },1000);
    }else{
        toast.error("wrong opt");
    }

    setIsLoading(false);
  };

  const handlePassword=async()=>{
    if (initPass.password !== initPass.cpassword) {
      toast.error("Passwords do not match");
      return;
    } else if (initPass.password.length < 6) {
      toast.error("Password should be at least 6 characters ");
      return;
    }

    try {
      setIsLoading1(true);
      const response=await axios.post(`${process.env.REACT_APP_URL}/auth/reset`,{
        email: email,
        password: initPass.password,
      });
      if(response.data.error) {
        toast.error(response.data.error);
        return;
      }
      toast.success(response.data.success);
      navigate(-1);
    } catch (error) {
        console.log(error);
    }finally{
      setIsLoading1(false);
    }
  }

  return (
    <div className="w-full h-full flex-center">
      <div className="">
        <div
          className={` mt-24 bg-gray-100 rounded-xl shadow-md px-10 py-12 max-w-xl w-full ${
            initVals.form1 ? "" : "hidden"
          }`}
        >
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
          <p className="">
            Enter your email address associated with LoanEase account
          </p>
          <p className="font-medium m-1 mt-6">Email</p>
          <TextField
            id="outlined-basic"
            placeholder="abc@gmail.com"
            fullWidth
            size="small"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-4"
            style={{ marginBottom: 10, height: "50px" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="mt-10"
            style={{ marginTop: 13 }}
            onClick={handleSubmit}
            disabled={isLoading2}
          >
            {isLoading2 ? <CircularProgress size={24} /> : "submit"}
          </Button>
        </div>

        {/* part 2 */}

        <div
          className={`mt-24 bg-gray-100 rounded-xl shadow-md px-10 py-12 max-w-xl w-full ${
            initVals.form2 ? "" : " hidden"
          }`}
        >
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
            {isLoading ? <CircularProgress size={24} /> : "submit" }
          </Button>
        </div>

        {/* part 3 */}

        <div
          className={`mt-24 bg-gray-100 rounded-xl shadow-md px-10 py-12 max-w-xl w-full ${
            initVals.form3 ? "" : " hidden"
          }`}
        >
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
          <p className=" font-semibold text-[17px] mb-2">Reset Password</p>
          <p className="">reset your password by entering a strong password</p>
          <div className=" flex flex-col mt-4 mb-2">
            <p className="font-medium m-1">Password</p>
            <TextField
              placeholder="password"
              id="outlined-adornment-password"
              type={showPass ? "text" : "password"}
              required
              fullWidth
              size="small"
              value={initPass.password}
              onChange={(e) =>
                setInitPass({ ...initPass, password: e.target.value })
              }
              className="mt-4"
              style={{ marginBottom: 15 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPass((prev) => !prev)}
                      edge="end"
                    >
                      {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <p className="font-medium m-1">Confirm password</p>
            <TextField
              placeholder="confirm password"
              id="outlined-adornment-password"
              type={showCPass ? "text" : "password"}
              fullWidth
              size="small"
              required
              value={initPass.cpassword}
              onChange={(e) =>
                setInitPass({ ...initPass, cpassword: e.target.value })
              }
              className="mt-4"
              style={{ marginBottom: 10 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowCPass((prev) => !prev)}
                      edge="end"
                    >
                      {showCPass ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="mt-10"
            style={{ marginTop: 13 }}
            onClick={handlePassword}
            disabled={isLoading1}
          >
            {isLoading1 ? <CircularProgress size={24} /> : "submit" }
            
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;


