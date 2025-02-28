import React,{useState,useEffect} from 'react';
import Navbar from  "./Navbar";
import Category from "./Category";
import Product from "./Product";
import Pos from "./Pos";
import { BrowserRouter as Router, Routes, Route ,Outlet } from "react-router-dom";
import axios from "axios";

function Home() {

     
  const [products,setProducts]=useState([]);

  const fetchProducts=async ()=>{
    const response=await axios.get("http://localhost:8080/api/product/allproduct");
    if(response.status===200){
      console.log("@@@@@@@@@@@@@@@@@@@@2",response.data);
      setProducts(response.data);
    }
  }  

    useEffect(()=>{
      fetchProducts()
    },[])


  return (
    <>
    <Navbar />  
     
        <Routes>
          <Route path="/Category" element={<Category />} />
          <Route path="/Product" element={<Product  products={ products}  fetchProducts={fetchProducts }/>} /> 
          <Route path="/Pos" element={<Pos products={products} />}  />
          </Routes>
        <Outlet />
    </>

    );
}

export default Home