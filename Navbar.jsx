import React from 'react';
import "./Navbar.css";
import {useNavigate} from "react-router-dom";
function Navbar() {
  const navigate=useNavigate();

  return (
    <>
    <div className="navbar">
        <div className="nav-buttons">
        <button >DASHBOARD</button>
        </div>
        <div className="left-nav">
         <button onClick={() => navigate("/home/Pos")}>POS</button>
         <button onClick={() => navigate("/home/Category")}>CATEGORY</button>
         <button onClick={() => navigate("/home/Product")}>PRODUCT</button>
         <button>REPORTS</button>
        </div>
          <div className="right-nav">
          <button>LOGOUT</button>
          </div>
      </div>
    </>
 );
}

export default Navbar