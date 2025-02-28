import React,{useState,useEffect} from 'react';
import Model from 'react-modal';
import "./Product.css";
import axios from "axios";

function Product({products,fetchProducts}) 
{

    const [category,setCategory]=useState(null);
    const [productName,setProductName]=useState("");
    const [productPrice,setProductPrice]=useState("");
    const [description,setDescription]=useState("");
    const [productImage,setProductImage]=useState(null); 
    const [useMessage,setUseMessage]=useState("");
    const [categories,setCategories]=useState([]);
    // const [products,setProducts]=useState([]);
    const [visible,setvisible]=useState(false);
    const [editId, setEditId] = useState(null);
    
    const [editedProduct, setEditedProduct] = useState(
      { productName:"",
        productPrice:"",
      });

    const [editedImage,setEditedImage]=useState(null);
    
    
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
    

    const handleProduct = async (e) => {
      e.preventDefault();
    console.log("@@@@@@@@@@");

    console.log("Category:", category, "Type:", typeof category);
    console.log("Product Name:", productName);
    console.log("Product Price:", productPrice);
    console.log("Description:", description);
    console.log("Product Image:", productImage);

    if (!category) {
        console.error("Category is null. Select a valid category.");
        return; 
    }

    const formData = new FormData();  
    formData.append("category", category);  
    formData.append("productName", productName);
    formData.append("productPrice", productPrice);
    formData.append("description", description);
    formData.append("productImage", productImage);


    console.log("FormData content:", [...formData.entries()]);
   
       try{
        const response=await axios.post(
            "http://localhost:8080/api/product/addproduct",
            formData
        );

     if(response.status===201)
      {
        setUseMessage(response.data);
        fetchProducts();//fetchproducts in product page on time.
        setvisible(false);     
        console.log(response.data);
      }   
    
    } catch (error) {
        setUseMessage(error);
        console.log(error);
    }
  
    }
    
    // const fetchProducts=async ()=>{
    //     const response=await axios.get("http://localhost:8080/api/product/allproduct");
    //     if(response.status===200){
    //       console.log(response.data);
    //       setProducts(response.data);
    //     }
    //   }  
    
    //     useEffect(()=>{
    //       fetchProducts()
    //     },[])

 
   const fetchCategories=async ()=>{
    const response=await axios.get("http://localhost:8080/api/category/allcategory");
    if(response.status===200){
      console.log(response.data);
      setCategories(response.data);
    }
  }  

    useEffect(()=>{
      fetchProducts();
      fetchCategories();
    },[]);

//-save Updated code= name, price , image--//  
  
  const handleEdit = (product) => {
    setEditId(product.productId);
    setEditedProduct({ 
        productName: product.productName,
        productPrice: product.productPrice, 
        productImage: product.productImage
    });
  };

 
   const handleSave = async (productId) => {
       
        const formData = new FormData();   
        formData.append('productName',editedProduct.productName);
        formData.append('productPrice',editedProduct.productPrice);
        formData.append('productImage',editedImage.productImage);  

    try {
        const response = await axios.put(`http://localhost:8080/api/product/updateproduct/${productId}`, 
          formData
        )

        if (response.status === 200) {
          setEditId(null);
            fetchProducts();
            console.log(response.data);
         
        }
    } catch (error) {
        console.log("Error updating product...", error);
    }
};

//--delete id --//

//  const handleDelete = async (productId) => {
//   try {
  
//     const response = await axios.delete(`http://localhost:8080/api/product/deleteproduct/${productId}`)
//     if (response.status === 200) {
//         setUseMessage(response.data);
//         fetchProducts();
     
//     }
// } catch (error) {
//     setUseMessage("Error deleting product...", error);
// }
// };


const handleDelete = async (productId) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/product/deleteproduct/${productId}`);
    if (response.status === 200) {
      fetchProducts();
      setUseMessage("Product deleted successfully.");
    }
  } catch (error) {
    console.error(error); 
    setUseMessage("Error deleting product. Please try again.");
  }
};












  return (
    <>
    <button className="btn btn-success w-100px" id="btn_product" onClick={()=>setvisible(true)}>+Add Product</button>     
        <Model isOpen={visible} onRequestClose={()=>setvisible(false)} style={customStyles}>
         <div className="container13">
                    <div className="panel13">
                    <h3>Add Product </h3>
                    <form onSubmit={handleProduct}>
                    <br />                                                                
                    <label>Category Id:</label> 
                    <br /> 
                    <select className="form-control" onChange={(e) =>setCategory(e.target.value  ? parseInt(e.target.value) : null)}>
                    <option value="">-- Select an Option --</option>
                    {
                        categories.map((category)=>(
                        <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                        ))
                    }
                    </select>
                    <br />
                    <input type="text" className="form-control" placeholder="product name" onChange={(e) =>setProductName(e.target.value)} />
                    <br />
                    <input type="text" className="form-control" placeholder="product price" onChange={(e) =>setProductPrice(e.target.value)} />
                    <br />
                    <input type="text" className="form-control" placeholder="product decription"  onChange={(e) =>setDescription(e.target.value)} />
                    <br />    
                    <input type="file" className="form-control" placeholder="product image" onChange={(e) =>setProductImage(e.target.files[0])} />
                    <br />
                    <button type="submit" className="btn btn-success w-50px mt-3 ms-5 me-2">+Add</button>
                    <button className="btn btn-danger  w-50px mt-3 ms-4 me-2" onClick={()=>setvisible(false)}>x Close</button>
                    </form>
                </div>    
            </div>

        </Model>  
 
<table>
  <thead>
    <tr>
      <th colSpan="9">ALL PRODUCT LIST</th>
    </tr>
    <tr>
      <td>ID</td>
      <td>CATEGORY</td>
      <td>NAME</td>
      <td>PRICE</td>
      <td>DESCRIPTION</td>
      <td>PRODUCT IMAGE</td>
      <td>STATUS</td>
      <td>ACTION</td>
    </tr>
  </thead>
  <tbody>
    {products.map((product) => (
      <tr key={product.productId}>
        <td>{product.productId}</td>
        <td>{product.category.categoryName}</td>
        
        <td className="border p-2">
          {editId === product.productId ? (
            <input
              type="text"
              value={editedProduct.productName}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, productName: e.target.value })
              }
              className="border p-1"
            />
          ) : (
            product.productName
          )}
        </td>

        <td className="border p-2">
          {editId === product.productId ? (
            <input
              type="number"
              value={editedProduct.productPrice}
              onChange={(e) =>
                setEditedProduct({ ...editedProduct, productPrice: e.target.value })
              }
              className="border p-1"
            />
          ) : (
            product.productPrice
          )}
        </td>

        <td className="border p-2">{product.description}</td>

        <td className="border p-2">
          {editId === product.productId ? (
            <input
              type="file"
              onChange={(e) =>
                setEditedImage({ ...editedImage, productImage: e.target.files[0] })
              }
              className="border p-1"
            />
          ) : (
            product.productImage
          )}
        </td>

        <td className="border p-2">{product.active ? "1" : "0"}</td>

        <td>
          {editId === product.productId ? (
            <button onClick={() => handleSave(product.productId)} className="btn btn-primary">
              Save
            </button>
          ) : (
            <button onClick={() => handleEdit(product)} className="btn btn-success">
              UPDATE
            </button>
          )}
          <button  onClick={() => handleDelete(product.productId)} className="btn btn-danger ms-4">DELETE</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </>
  )
}
export default Product