import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allusers, setAllusers] = useState([]);
  const navigate=useNavigate();

  const fetchUsers=async()=>{
    try {
      const response=await axios.get(`${process.env.REACT_APP_URL}/auth/allUsers`);
      if(response) {
        console.log("allusers",response);
        setAllusers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchUsers();
  },[]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value === "") {
      setFilteredData([]);
    } else {
      allusers.length>0 && allusers.forEach((user)=> {
        if(user.username.toLowerCase().includes(value.toLowerCase())) {
          setFilteredData((filteredData)=> {
            const exists=filteredData.some((item)=> item._id===user._id);
            if(exists) {
              return filteredData;
            }else{
              return [...filteredData, user];
            }
          })
        } else {
          setFilteredData((filteredData)=> filteredData.filter((u)=> u._id !== user._id));
        }
      })
    }
  };

  return (
    <div className="w-full h-full flex justify-start items-start p-2">
      <div className="max-w-xl w-full relative">
        <div className="relative">

          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <IoIosSearch size={24} />
          </span>

          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search here..."
            className="w-full pl-12 pr-4 py-2 border rounded-full shadow-sm border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredData.length > 0 && (
          <div className="z-40 absolute w-full bg-white shadow-lg rounded-lg mt-2 max-h-60 overflow-y-auto">
            {filteredData.map((item) => (
              <div
                key={item.id}
                onClick={(e)=> navigate(`/adminUser/${item._id}`)}
                className="p-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center"
              >
                <Avatar
                  src={item.profilePic}
                  alt={item.username}
                />
                <p className="">{item.username}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

