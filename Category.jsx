import React,{useState,useEffect} from 'react';
import Model from 'react-modal';
import "./Category.css";
import axios from "axios";

function Category() {
  
  const [categoryName,setcategoryName]=useState("");
  const [categoryImage,setcategoryImage]=useState(null);
  const [isActive,setisActive]=useState("");
  const [useMessage,setUseMessage]=useState("");
  const [categories,setCategories]=useState([]);

  const fetchCategories=async ()=>{
    const response=await axios.get("http://localhost:8080/api/category/allcategory");
    if(response.status===200){
      console.log(response.data);
      setCategories(response.data);
    }
  }  

    useEffect(()=>{
      fetchCategories();
    },[])


  const handleCategory=async (e) =>{
    e.preventDefault();
  
   const formdata = new FormData(); 
   formdata.append('categoryName',categoryName);
   formdata.append('categoryImage',categoryImage);
   formdata.append('isActive',isActive);
   
    
    try{
      const response=await axios.post(
          "http://localhost:8080/api/category/addcategory",formdata
      
      );

   if(response.status===201)
    {
      setUseMessage(response.data);
      setvisible(false);     
      fetchCategories();
      console.log(response.data);
    }   
  
  } catch (error) {
      setUseMessage(error.response.data)
      console.log(error);
  }

  }

   const [visible, setvisible] = useState(false); 
   const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      color :'black',
      transform: 'translate(-50%, -50%)',
    },
  };

  const handleAdd=()=>{
    if(!categoryName)
    {
      alert("Please provide category name..");
    }
    else if(!categoryImage)
    {
      alert("Please provide Category Image..");
    }
  }

  return (
    <>
     <button className="btn btn-success w-100px" id="btn" onClick={()=>setvisible(true)}> +ADD CATEGORY</button>
       <Model isOpen={visible} onRequestClose={()=>setvisible(false)} style={customStyles}>
         <div className="container12">
                <div className="panel12">
                 <h3>Add Category</h3>
                    <form onSubmit={handleCategory}>
                    <br />                                                                 
                    <input type="text" className="form-control" placeholder="Category Name" onChange={(e) =>setcategoryName(e.target.value)}   />  
                    <br />
                    <input type="file" className="form-control" onChange={(e) =>setcategoryImage(e.target.files[0])}/>
                    <p>Please select Status</p>
                    <input type="radio" name="status" onChange={(e) =>setisActive(true)} />{" "}
                    <label>Active</label>
                    {" "}
                    {" "}
                    <input type="radio" name="status" onChange={(e) =>setisActive(false)}/>{" "}
                    <label>Inactive</label>
                    <br />
                    <button className="btn btn-success w-50px mt-3 ms-5 me-2" onClick={handleAdd} >+Add</button>
                    <button className="btn btn-danger  w-50px mt-3 ms-4 me-2" onClick={()=>setvisible(false)}>x Close</button>
                    </form>
                </div>    
         </div>
    </Model>

    <table>
      
        <thead>
        <th colspan="5">ALL CATEGORY LIST</th>  
        <tr>
        <td>ID</td>
        <td>NAME</td>
        <td>IMAGE</td>
        <td>ACTIVE/INACTIVE</td>
        <td>ACTION</td>
        </tr>
        </thead>

        <tbody>
        {
          categories.map((category)=>(
            <tr key={category.categoryId}> 
            <td>{category.categoryId}</td>
            <td>{category.categoryName}</td>
            <td>{category.categoryImage}</td>
            <td>{category.active==true ? "1" : "0"}</td>
            <td>
              <button className="btn btn-success">UPDATE</button>
              <button className="btn btn-danger ms-4 ">DELETE</button>  
            </td>
            </tr>
          ))
        }
        </tbody>
    </table>  
  </>
  );
}

export default Category

