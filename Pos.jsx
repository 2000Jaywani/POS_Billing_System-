import React,{useState,useEffect} from 'react';
import "./Pos.css";
import axios from "axios";
import Model from 'react-modal';

import { ToastContainer, toast } from 'react-toastify';
function Pos({products}) {

 // const notify = () => toast("Wow so easy!");
    const notify=()=>toast.error('Data is Clear', {
      position: "bottom-right",
      autoClose: 1000,     
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      
    });

  const [category,setCategory]=useState(null);
  const [categories,setCategories]=useState([]);
  const [customerName,setcustomerName]=useState("");
  const [customerContact,setcustomerContact]=useState("");
  const [customerAddress,setcustomerAddress]=useState("");
  const [useMessage,setUseMessage]=useState("");
  const [filteredProducts,setFilteredProducts]=useState([])
  const [cartItems, setCartItems] = useState([]);

  const [discount,setDiscount]=useState("");
  const [gstAmt, setGstAmt]=useState("");
  const [serviceCharge,setServiceCharge]=useState("");
  const [paymentMode,setPaymentMode]=useState("");


  const [searchedCustomer,setSearchedCustomer]=useState([]);
  const [searchTerm,setSearchTerm]=useState(null);
  const [allCustomers,setAllCustomers]=useState([]);
  const [selectedCustomers,setSelectedCustomer]=useState(null);

  const [totalAmt,setTotalAmt]=useState(0);
  const [totalNetAmt, setTotalNetAmt] = useState(0)


  useEffect(() => {
    let total=0;
    cartItems.forEach(product => {
      total +=product.quantity * product.productPrice;
    }

    );
    setTotalAmt(total);
  },[cartItems]);

  //const [filteredProducts,setFilteredProducts]=useState("");

  useEffect(() => {
    if (category === "All Categories") {
      setFilteredProducts(products);  // Show all products if 'All Categories' is selected
    } else if (category) {
      const filtered = products.filter(
        (product) => String(product.category.categoryId) === String(category)
      );
      console.log(filtered, "filtered");
      setFilteredProducts(filtered);  // Filter products by selected category
    }
  }, [category, products]);  // Trigger this useEffect when 'category' or 'products' change
  

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);


  const fetchCategories=async ()=>{
    const response=await axios.get("http://localhost:8080/api/category/allcategory");
    if(response.status===200){
      console.log(response.data);
      setCategories(response.data);
    }
  }; 


    useEffect(()=>{
      fetchCategories();
    },[]);

    
   const [visible, setvisible] = useState(false); 
   const customStyles = {
    content: {
      top: '50%',
      left: '45%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      color :'black',
      transform: 'translate(-50%, -50%)',
    },
  };
//--add customer ,name, address,contact--///

const handleCustomer=async (e) =>{
  e.preventDefault();
 
  try{
    const response=await axios.post(
        "http://localhost:8080/api/customer/addcustomer",
          {
            customerName,
            customerContact,
            customerAddress
          }
          
        );
if(response.status===200)
  {
    setUseMessage(response.data);
    setvisible(false);     
    console.log(response.data);
  }   

} catch (error) {
    setUseMessage(error)
    console.log(error);
}

};
//--decreasequantity by -1

const decreaseQuantity = (product) => {
  setCartItems((prevItems) => {
    // Decrease quantity if greater than 1
    const updatedItems = prevItems.map((prod) =>
      prod.productId === product.productId
        ? { ...prod, quantity: prod.quantity - 1 }
        : prod
    );
    
    // Remove product if its quantity is 0
    return updatedItems.filter((prod) => prod.quantity > 0);
  });
};
//-----------------------------------------------------------------------------------
const increaseQuantity = (product) => {
  setCartItems((prevItems) =>{
    const updatedItems =prevItems.map((prod) =>
      prod.productId===product.productId
      ? {...prod,quantity:prod.quantity + 1 }
      :prod
    );
    return updatedItems; 
  });
};

//-AddProductCart in direct product---

const addProductToCart = (product) => {
  const isFound = cartItems.find((prod) => prod.productId === product.productId);

  if (isFound) {
    setCartItems(
      cartItems.map((prod) =>
        prod.productId === product.productId
          ? { ...product, quantity: prod.quantity + 1 }
          : prod
      )
    );
  } else {
    setCartItems([...cartItems, { ...product, quantity: 1 }]);
  }
};

useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/customer/allcustomers");
      if (response.status === 200) {
        setAllCustomers(response.data); // Store the found customers in state
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  fetchCustomers();
}, []);

//set searched term
useEffect(()=>{
  if(searchTerm==""){
    setSearchedCustomer([])
  }
  if(searchTerm)
  {
    const isFounded=allCustomers.filter((customer)=>customer.customerName.toLowerCase().includes(searchTerm) || String(customer.contact).includes(searchTerm));
    console.log(isFounded);
    setSearchedCustomer(isFounded);
    
  }
},[searchTerm])


//-total amount

const handleDiscountChange = (e) => {
  const value = parseInt(e.target.value) || 0; 
  setDiscount(value);
};

const handleGstAmtChange = (e) => {
  const value = parseInt(e.target.value) || 0; 
  setGstAmt(value);
};

const handleServiceChargeChange = (e) => {
  const value = parseInt(e.target.value) || 0;  
  setServiceCharge(value);
};

const calculateTotalAmount = (discount, totalAmt, gstAmt, serviceCharge) => {
  if (totalAmt > 0) {
    const disAmt = totalAmt * (discount / 100);  // Apply discount percentage
    const totalDis = totalAmt - disAmt;
    const totalNet = totalDis + gstAmt + serviceCharge; 
 
  setTotalNetAmt(totalNet);  // Set the total amount to the state
  }
};

useEffect(() => {
  calculateTotalAmount(discount, totalAmt, gstAmt, serviceCharge);
}, [discount, totalAmt, gstAmt, serviceCharge]);  // Recalculate when any of these values change


//handle bill submit last code

const handleBillSubmit = async (e) => {
  e.preventDefault();
  // Preparing product list for the API call
  const sendTosave = cartItems.map(product => ({
    product,
    quantity: product.quantity,
  }));

  // Logging request data for debugging
  console.log({
    totalAmt,
    gstAmt,
    discount,
    serviceCharge,
    customer: selectedCustomers,
    paymentMode,
    productList: sendTosave
  });

  try {
    // Sending data to the backend
    const response = await axios.post(`http://localhost:8080/api/bill/addbill`, {
      totalAmount: totalAmt, // Assuming totalAmt is the total amount you want to send
      taxAmount: gstAmt,
      discount,
      serviceCharge,
      customer: selectedCustomers,
      paymentMode,
      productList: sendTosave
    });

    if (response && response.status === 201) {
      setUseMessage(response.data); // Assuming setUseMessage is to handle success message
         toast.success('Bill Added Sucecesfully.....',{
        position: "bottom-right",
        autoClose: 2000,     
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
     //alert("Bill Added Succesfully ....");
      console.log(response.data);
    } else {
      console.error("Unexpected response:", response);
    }
  } catch (error) {
    if (error.response) {
      setUseMessage(error.response.data); // Assuming this sets the error message
      console.log(error.response.data);
    } else {
      console.error("Error without response data:", error);
      setUseMessage("An unexpected error occurred.");
    }
  }
};



 return (
   <>   
    <div className="conatainer_pos">
           <span className="span1"> 
            <select id="btn_id"  name="categories"  className="form-select" onChange={(e) => setCategory(e.target.value)} >
            <option value="All Categories">All Categories</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
          </span> 
    
           <span className="span2">          
           <input type="search"  className="form-control" placeholder="Search Product" />           
           </span>       

          <span className="span3">
          <input type="search" className="form-control"  placeholder="Search Customer"
           onChange={(e)=>setSearchTerm(e.target.value)} /> 
          </span>         

          <span className="span4">
          <button className="btn btn-success w-100px" onClick={()=>setvisible(true)} > +ADD CUSTOMER</button>
          </span>          
    </div>


{/* ------------------------------------------------------------------------------------------------------------ */}
{
       searchedCustomer.length >0 && (
        <div className="form-control" style={{border: "1px solid black",zIndex: "2000",width: "310px",position: "fixed",marginLeft:"890px"}} >
        {
          searchedCustomer.map((customer,index)=>(
              <option key={index} value={customer} 
            onClick={() => setSelectedCustomer(customer.customerId)}>
             {customer.customerName} +{customer.customerContact}</option>
          ))
        }                   
    </div>
      )
    }

{/* ------------------------------------------------------------------------------------------------------------ */}

      <div style={{ display:"flex" , overflow:'scroll'}}>
        <div style={{display:"flex",width:"52vw",margin:"2vw",flexWrap:'wrap' ,
          overflowY: "auto", height: "80vh" }}>
          {
            filteredProducts.map((product)=>(
            <div key={product.productId} style={{padding:"10px",margin:"10px",width:"170px",height:"36vh",border:"1px solid black",backgroundColor:'lightgray',boxShadow:'0 7px 11px rgb(37, 38, 39)'}} onClick={() => addProductToCart(product)} >
              <mark style={{fontFamily:'Arial, Helvetica, sans-serif', textAlign:'center'}}>Available Products</mark>
              <img id="img_scale" src={`http://localhost:8080/image/${product.productImage}`} style={{height:"130px",width:"130px",borderRadius:"5px"}} alt="" />
              <h5 style={{ textAlign: 'center'}}>{product.productName}</h5>
              <h5 style={{ textAlign: 'center'}}>₹ {product.productPrice}</h5>
            </div>
            ))
          }
      </div>

{/* ------------------------------------------------------------------------------------------------------------ */}

 {/* position: "fixed",   */}
<div  style={{width: "40vw", margin: "2vw",padding:"2px", right: "0",  top: "10vh", margin: "2vw",padding: "2px", marginTop:"15px", zIndex: 1000}}>
          <table style={{width:'100%',textAlign:'center'}}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
            {
               cartItems.map(product=>(
                <tr key={product.productId}>
                  <td>{product.productName}</td>
                  <td><button onClick={()=>decreaseQuantity(product)} className="btn btn-success">-Remove</button>
                     {" "} {product.quantity} {" "}
                      <button onClick={()=>increaseQuantity(product)} className="btn btn-danger" >+Add</button> 
                  </td>
                  <td>{product.productPrice}</td>
                  <td>{product.quantity*product.productPrice}</td>
                </tr>
               ))
            }
            </tbody>
          </table>
        </div>


{/* ------------------------------------------------------------------------------------------------------------- */}
     </div>

<br /><br /><br />

<Model isOpen={visible} onRequestClose={()=>setvisible(false)} style={customStyles}>
         <div className="container-cus"> 
                <div > 
                  <h3>Add Customer</h3>
                    <form onSubmit={handleCustomer}>
                    <input type="text" className="form-control" placeholder="customer name"  onChange={(e) =>setcustomerName(e.target.value)} />
                    <br />  
                    <input type="text" className="form-control" placeholder="customer contact"  onChange={(e) =>setcustomerContact(e.target.value)} />
                    <br />  
                    <input type="text" className="form-control" placeholder="customer address"  onChange={(e) =>setcustomerAddress(e.target.value)} />
                    <br />  
                    <button className="btn btn-success w-50px mt-3 ms-5 me-2" >+Add</button>
                    <button className="btn btn-danger  w-50px mt-3 ms-4 me-2" onClick={()=>setvisible(false)} >x Close</button>
                    </form>
                </div>    
         </div>
</Model>
{/* ------------------------------------------------------------------------------------------------------------ */}
   
<div className="div_footer">
    <span>
       <label>DISCOUNT</label> 
       <select id="btn_id" className="form-select" onChange={handleDiscountChange}>
          <option>% Discount</option>  
          <option value="5">% 5</option>
          <option value="12">% 12</option>
          <option value="18">% 18</option>
        </select>
    </span>
    
    <span id="sp2">
     <label>GST AMOUNT </label>
     <br />       
     <input type="text" className="form-control" placeholder="0" onChange={handleGstAmtChange}/>       
    </span>
    
    <span id="sp3">
      <label>SERVICE CHARGE</label>
      <br />
      <input type="text" className="form-control" placeholder="0" onChange={handleServiceChargeChange}/>
    </span>
    
    <span id="sp4">
     <label>PAYMENT METHOD</label>
     <br />    
        <select className="form-select w-100" onChange={(e)=>setPaymentMode(e.target.value)}>
          <option value="CASH">CASH</option>
          <option value="UPI">UPI</option>
          <option value="CARD">CARD</option>
        </select>
    </span>
    
    <span id="sp5">
      <label > TOTAL : ₹{totalAmt} NET : ₹{totalNetAmt} </label>
      <br />
      <button className="btn btn-success" onClick={notify} >CLEAR ALL</button>      
      <button id="btn_order" className="btn btn-danger" onClick={handleBillSubmit} >PLACE ORDER</button>   
      <ToastContainer />
    </span> 
</div>
    </>
  )
}
export default Pos;