import React,{useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./Login.css";

import { toast } from 'react-toastify';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  
  const [userName,setUserName]=useState("");
  const [password,setPassword]=useState("");
  const [useMessage,setUseMessage]=useState("");
  const nevigate=useNavigate()  

  const handleLogin= async (e)=>{
        e.preventDefault();

        try{
            const response=await axios.post(
                "http://localhost:8080/api/user/log",
            {
                userName,
                password
            }
            );

         if(response.status===200){
            setUseMessage(response.data)
            console.log(response.data);

         }   
        
        } catch (error) {
            setUseMessage(error.response.data)
            console.log(error);

        }
  };

  const goToRegister=()=>{
        nevigate("/register")
  };

  const goToHome=()=>{
        nevigate("/home")
  };
  return (
<div class="login_set">

    <div className="form-container">
    <h1>Sign in</h1>
    <br/>
    <form onSubmit={handleLogin}>
    <input type="text" placeholder="Enter username" onChange={(e) =>setUserName(e.target.value)} />{" "} <br/><br/>
    <input type="password" placeholder="Enter password" onChange={(e) =>setPassword(e.target.value)} />{" "}<br/><br/>
    <button type="submit" onClick={goToHome} className="btn btn-success w-100">Login</button><br/><br/>
    <ToastContainer />
    <b>Register here</b> 
     <br />
     <br />
       <button type="submit" onClick={goToRegister} className="btn btn-primary w-100">Register</button><br/><br/>
                                                             {/* btn_register           */}
       
    <h2>{useMessage}</h2>
    </form>
    </div>
    </div>
); 
}

export default Login