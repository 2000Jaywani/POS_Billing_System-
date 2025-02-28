import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login"; 
import Registration from "./Components/Registration";
import Home from "./Components/Home";
import "bootstrap/dist/css/bootstrap.min.css";

//import Navbar "./Components/Navbar";

function App() {
  return (
    <>
       <Router>
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/home/*" element={<Home />} />   
           </Routes>
        </Router>   
    </>
  );
}
export default App;
