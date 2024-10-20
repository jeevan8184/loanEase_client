import React, { useCallback, useEffect, useState } from "react";
import { MdAccountBalance, MdEdit, MdSave } from "react-icons/md";
import { useDropzone } from "react-dropzone";
import { FaUser } from "react-icons/fa";
import {
  Avatar,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { TOKEN, USER } from "../constants";

const OnBoard = () => {
  const [File, setFile] = useState([]);
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initVals, setInitVals] = useState({
    phoneNo: "",
    type: "customer",
    gender: "Male",
    profilePic: "",
  });
  const currUser=useSelector((state)=> state?.reducer?.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [params]=useSearchParams();

  useEffect(()=> {
    if(!params.get("login")) {
      navigate("/");
    }
  },[params]);

  console.log("currUser",currUser);

  useEffect(()=> {
    if(!currUser) {
      navigate("/login");
    }
  },[currUser]);


  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles);
    const reader = new FileReader();
    reader.onload = async () => {
      setImgUrl(reader.result);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!initVals.phoneNo) {
      toast.error("Please enter phone number");
      return;
    } else if (initVals.phoneNo.trim().length <10 || initVals.phoneNo.trim().length >10) {
      toast.error("Phone number should be 10 digits");
      return;
    }

    try {
      setIsLoading(true);
      if (imgUrl) {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/auth/upload`,
          {
            data: imgUrl,
          }
        );
        setInitVals({ ...initVals, profilePic: response?.data });
      }else{
        setInitVals({...initVals, profilePic: currUser?.profilePic });
      }

      const response=await axios.post(`${process.env.REACT_APP_URL}/auth/onBoard`,{
        phoneNo: initVals.phoneNo,
        gender: initVals.gender,
        profilePic: initVals.profilePic,
        userId: currUser?._id,
        role:initVals.type
      });
      if(response) {
        dispatch({type:USER,payload:response?.data});
        if(initVals.type==="admin") {
          let newText="";
          for (let i = 0; i < 6; i++) {
            const char = Math.floor(Math.random() * 10);
            newText += char.toString();
          }

          const sendMail=await axios.post(`${process.env.REACT_APP_URL}/auth/sendMail`,{
            email: response.data.email,
            msg: `Your one time password for verification of admin is ${newText}`,
          });
          if(sendMail) {
            toast.success(sendMail.data.message+" "+newText);
            navigate(`/verifyAdmin`,{state:{otp:newText}});
          }
        }else{
          navigate('/');
        }
      }
 
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setInitVals({phoneNo: "",
        type: "customer",
        gender: "Male",
        profilePic: ""});
    }
  };

  return (
    <div className="w-full h-full flex-center">
      <div className="mt-4 bg-gray-100 rounded-xl shadow-md px-10 py-8 max-w-xl w-full">
        <h1 className=" font-semibold text-2xl my-2 text-center">
          SetUp Your Profile
        </h1>
        <div className=" relative overflow-hidden  flex-center px-2 py-2 rounded-full">
          {File.length > 0 ? (
            <div className=" rounded-full overflow-hidden h-52 w-52 flex-center">
              <Avatar
                src={URL.createObjectURL(File[0])}
                className="rounded-full bg-white"
                alt="image"
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          ) : (
            <div className="">
              {currUser?.profilePic ? (
                <div className="relative h-52 w-52">
                  <Avatar
                    src={currUser?.profilePic}
                    className="rounded-full bg-white"
                    alt="image"
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
              ) : (
                <div className="relative h-60 w-60 rounded-full bg-gray-200 flex-center">
                  <Avatar
                    className=" relative h-full w-full "
                    style={{ height: 240, width: 240 }}
                  >
                    <FaUser size={200} />
                  </Avatar>
                </div>
              )}
            </div>
          )}
          <div className=" absolute bottom-1  flex-between gap-1 z-40 max-sm:bottom-2 cursor-pointer">
            <div
              {...getRootProps()}
              className=" px-4 py-0.5 rounded-full bg-[#877EFF] text-white"
            >
              <input {...getInputProps()} />
              <div className=" flex gap-1">
                <MdEdit size={20} />
                <p className=" text-white">Edit</p>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col gap-2 my-4">
          <p className="font-medium m-1">Phone number</p>
          <TextField
            id="outlined-basic"
            placeholder="+91 0000000000"
            fullWidth
            type="number"
            required
            size="small"
            value={initVals.phoneNo}
            onChange={(e) =>
              setInitVals({ ...initVals, phoneNo: e.target.value })
            }
            className="mt-4"
            style={{ marginBottom: 10 }}
          />

          <FormControl fullWidth style={{ marginBottom: 15 }}>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Type"
              value={initVals.type}
              defaultValue="customer"
              onChange={(e) => {
                setInitVals((prev) => ({ ...prev, type: e.target.value }));
              }}
              size="small"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth style={{ marginBottom: 15 }}>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Gender"
              value={initVals.gender}
              defaultValue="male"
              onChange={(e) => {
                setInitVals((prev) => ({ ...prev, gender: e.target.value }));
              }}
              size="small"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            color="primary"
            className="mt-4"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnBoard;
