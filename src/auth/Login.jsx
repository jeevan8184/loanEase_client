import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  MdAccountBalance,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TOKEN, USER } from "../constants";
import { jwtDecode } from "jwt-decode";


const Login = () => {
  const [initVals, setInitVals] = useState({
    password: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const emailMatch = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const dispatch=useDispatch();

  const token=localStorage.getItem('token');

  useEffect(()=> {
    if(token) {
      navigate("/");
    }
  },[navigate, token]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailMatch.test(initVals.email)) {
      toast.error("Invalid Email");
      return;
    } else if (initVals.password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }

    try {
      setIsLoading(true);
      toast.success("toats"+process.env.REACT_APP_URL);

      const api = await axios.post(`${process.env.REACT_APP_URL}/auth/login`, {
        email: initVals.email,
        password: initVals.password,
      });

      if (api?.data) {
        if (api?.data?.message) {
          dispatch({type:USER,payload:api?.data?.user});
          dispatch({type:TOKEN,payload:api?.data?.token});
          toast.success(api?.data?.message);
          navigate("/");
        } else if (api?.data?.error) {
          toast.error(api?.data?.error);
          return;
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
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
        <h1 className="text-2xl font-semibold text-center mb-6 mt-2">Login</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <p className="font-medium m-1">Email</p>
          <TextField
            id="outlined-basic"
            placeholder="abc@gmail.com"
            fullWidth
            size="small"
            required
            value={initVals.email}
            onChange={(e) =>
              setInitVals({ ...initVals, email: e.target.value })
            }
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
            size="small"
            value={initVals.password}
            onChange={(e) =>
              setInitVals({ ...initVals, password: e.target.value })
            }
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
          <div className="text-end">
            <p
              className=" text-blue-500 font-medium text-[15px] mb-2 cursor-pointer"
              onClick={() => navigate("/resetpass")}
            >
              Forgot password ?{" "}
            </p>
          </div>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="mt-8"
            style={{ marginTop: 10 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} style={{ color: "" }} />
            ) : (
              "login"
            )}
          </Button>
          <div className="">
            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <strong
                className="font-bold cursor-pointer text-blue-500"
                onClick={() => navigate("/signup")}
              >
                SignUp
              </strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

