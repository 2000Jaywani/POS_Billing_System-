import React,{useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./Registration.css";

function Registration() {

  
  const goToLog=()=>{
    nevigate("/Login");
   };
  
  const [userFullName,setUserFullName]=useState("");
  const [userAddress,setUserAddress]=useState("");
  const [userEmail,setUserEmail]=useState("");
  const [contact,setContact]=useState("");
  const [userName,setUserName]=useState("");
  const [password,setPassword]=useState("");
  const [useMessage,setUseMessage]=useState("");
  const nevigate=useNavigate()
  const handleRegister=async (e)=>{
      e.preventDefault();
      try {
        
        const response=await axios.post(
          
          "http://localhost:8080/api/user/register",
          {
            userFullName,
            userAddress,
            userEmail,
            contact,
            userName,
            password
          }
        );
        if(response.status===200){
            setUseMessage(response.data);
            console.log(response.data);
          }

      } catch (error) {
        setUseMessage(error.response.data);
        console.log(error);
      }
  }

    return (
    <>
    <div class="register_set">
      
     <div class="container1">
     
      <div className="filds">
      <h2>Sign Up </h2>
      <form onSubmit={handleRegister}>
      <input type="text" placeholder="User Full Name" onChange={(e) =>setUserFullName(e.target.value)} />{" "}<br/><br/>
      <input type="text" placeholder="User Address" onChange={(e) =>setUserAddress(e.target.value)} />{" "}<br/><br/>
      <input type="email" placeholder="User email" onChange={(e) =>setUserEmail(e.target.value)}/>{" "}<br/><br/>
      <input type="text" placeholder="User contact" onChange={(e) =>setContact(e.target.value)}/>{" "}<br/><br/>
      <input type="text" placeholder="User Name" onChange={(e) =>setUserName(e.target.value)} />{" "}<br/><br/>
      <input type="password" placeholder="password" onChange={(e) =>setPassword(e.target.value)} />{" "}<br/><br/>
      <button type="submit" onClick={goToLog}  className="btn btn-primary w-100" >Enroll Now !</button><br/><br/>
      <h2>{useMessage}</h2>
         
      </form>

      </div>                            
  
      </div>
    </div>
    </>
  );
}

export default Registration
