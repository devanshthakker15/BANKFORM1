import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BankFormPage from "./pages/BankFormPage";
import BankDetailsList from "./pages/BankDetailsList";
import "bootstrap/dist/css/bootstrap.min.css";


const App: React.FC = () => {
 return (
   <Router>
     <Routes>
       <Route path="/" element={<BankFormPage />} />
       <Route path="/bank-details-list" element={<BankDetailsList />} />
     </Routes>
   </Router>
 );
};


export default App;