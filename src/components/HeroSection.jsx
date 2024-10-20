import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate=useNavigate();

  return (
    <section className="w-full h-full min-h-screen flex">
      <div className="flex-1 flex flex-col p-10 max-w-2xl mt-8">
        <h1 className="text-5xl max-sm:text-3xl font-bold text-white">
          Easy Loans for Everyone
        </h1>
        <p className=" text-gray-200 font-normal mt-10">
            Accessing funds should be simple, and our Easy Loans for Everyone program makes it possible. With fast approval times, you can get the financial support you need without long waits. Our flexible repayment options allow you to choose a plan that fits your budget, ensuring you can manage your finances with ease.
        </p>
        <p className="mt-10 text-lg text-gray-100 font-semibold">
          Fast approval and flexible repayments. Apply today and take control of your finances.
        </p>
        <button className="mt-20 max-sm:mt-24 max-w-sm inline-block bg-[#00A8E8] text-white text-lg px-6 py-2 rounded-lg shadow-lg hover:bg-[#007BB5] transition duration-300 ease-in-out" 
            onClick={()=> navigate("/applyLoan")}
        >
            Apply for a loan
        </button>
       
      </div>
    </section>
  );
};

export default HeroSection;



