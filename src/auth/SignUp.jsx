import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MdAccountBalance,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { TOKEN, USER } from "../constants";

const SignUp = () => {
  const [initVals, setInitVals] = useState({
    username: "",
    password: "",
    cpassword: "",
    email: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const navigate = useNavigate();
  const emailMatch = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const dispatch=useDispatch();

  const token=localStorage.getItem('token');

  useEffect(()=> {
    if(token) {
      navigate("/");
    }
  },[token]);


  const handleSubmit =async(e) => {
    e.preventDefault();

    if (initVals.password !== initVals.cpassword) {
      toast.error("Passwords do not match");
      return;
    } else if (!emailMatch.test(initVals.email)) {
      toast.error("Invalid Email");
      return;
    } else if (initVals.password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }

    try {
      setIsLoading(true);
      const api=await axios.post(`${process.env.REACT_APP_URL}/auth/signup`,{
        username: initVals.username,
        email: initVals.email,
        password: initVals.password,
      });

      if(api?.data) {
        if(api?.data?.message) {
          dispatch({type:USER,payload:api?.data?.user});
          dispatch({type:TOKEN,payload:api?.data?.token});
          toast.success(api?.data?.message);
          navigate(`/onBoard?login=${true}`);
        }else if(api?.data?.error) {
          toast.error(api?.data?.error);
          return;
        }
      }
    } catch (error) {
      console.log(error);
      
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex-center">
      <div className="mt-16 bg-gray-100 rounded-xl shadow-md px-10 py-8 max-w-xl w-full">
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
        <h1 className="text-2xl font-semibold text-center mb-6 mt-2">SignUp</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <p className="font-medium m-1">Email</p>
          <TextField
            id="outlined-basic"
            placeholder="abc@gmail.com"
            fullWidth
            required
            size='small'
            value={initVals.email}
            onChange={(e) => setInitVals({ ...initVals, email: e.target.value })}
            className="mt-4"
            style={{ marginBottom: 10 }}
          />
          <p className="font-medium m-1">Username</p>
          <TextField
            id="outlined-basic"
            placeholder="Username"
            fullWidth
            required
            size='small'
            value={initVals.username}
            onChange={(e) => setInitVals({ ...initVals, username: e.target.value })}
            className="mt-4"
            style={{ marginBottom: 10 }}
          />
          <p className="font-medium m-1">Password</p>
          <TextField
            placeholder="password"
            id="outlined-adornment-password"
            type={showPass ? "text" : "password"}
            required
            fullWidth
            size='small'
            value={initVals.password}
            onChange={(e) => setInitVals({ ...initVals, password: e.target.value })}
            className="mt-4"
            style={{ marginBottom: 10 }}
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
            size='small'
            required
            value={initVals.cpassword}
            onChange={(e) => setInitVals({ ...initVals, cpassword: e.target.value })}
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="mt-8"
            style={{ marginTop: 10 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "signup" }
            
          </Button>
          <div className="">
            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <strong className="font-bold cursor-pointer text-blue-500" onClick={() => navigate("/login")}>
                Login
              </strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
