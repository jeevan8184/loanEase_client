import { Route, Routes, useLocation } from "react-router-dom";
import MainContainer from "./components/MainContainer";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";
import ResetPass from "./auth/ResetPass";
import OnBoard from "./auth/OnBoard";
import Profile from "./components/Profile";
import MyLoans from "./components/MyLoans";
import ApplyLoan from "./components/ApplyLoan";
import Navbar from "./components/Navbar";
import LoanDetails from "./components/LoanDetails";
import Footer from "./components/Footer";
import VerifyAdmin from "./auth/VerifyAdmin";
import LoansAdmin from "./components/LoansAdmin";
import AdminLoanDetails from "./components/AdminLoanDetails";
import AdminUserprofile from "./components/AdminUserprofile";

function App() {

  const routes=["/","/profile","/myLoans","/loanDetails","/applyLoan","/loansAdmin"];
  const {pathname}=useLocation();

  
  return (
    <div className=" flex flex-col">
      <div className=' sticky top-0 z-50'>
        {(routes.includes(pathname) || pathname.includes("/loanDetails") || pathname.includes("/admin/loanDetails")
          || pathname.includes("/adminUser")
        ) && (
          <Navbar />
        )}
      </div>
      <Routes>
        <Route exact element={<MainContainer />} path="/" />
        <Route exact element={<Profile />} path="/profile" />
        <Route exact element={<MyLoans />} path="/myLoans" />
        <Route exact element={<ApplyLoan />} path="/applyLoan" />
        <Route exact element={<LoanDetails />} path="/loanDetails/:loanId" />

        <Route exact element={<LoansAdmin />} path="/loansAdmin" />
        <Route exact element={<AdminLoanDetails />} path="/admin/loanDetails/:loanId" />
        <Route exact element={<AdminUserprofile />} path="/adminUser/:userId" />


        <Route exact element={<SignUp />} path="/signup" />
        <Route exact element={<Login />} path="/login" />
        <Route exact element={<ResetPass />} path="/resetpass" />
        <Route exact element={<OnBoard />} path="/onBoard" />
        <Route exact element={<VerifyAdmin />} path="/verifyAdmin" />
        
      </Routes>
      <div className=' z-40'>
        {(routes.includes(pathname) || pathname.includes("/loanDetails") || pathname.includes("/adminUser") || 
            pathname.includes("/admin/loanDetails")
        ) && (
          <Footer />
        )}
      </div>
    </div>
  );
}

export default App;

