import React, { useState, useEffect } from "react";
import { Link, useLocation,useHistory } from 'react-router-dom';
const Updatestockstaff = () => {
  const history = useHistory();
  const [products, setProducts] = useState([]); // Correct initial state as an empty array
  const [productData, setProductData] = useState([]); // Separate state for editable product data
  const now = new Date();
  const branchID= localStorage.getItem("branchid");
  const formattedDate = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // Fetch products from the server on component mount
  useEffect(() => {
      const token = localStorage.getItem('authToken'); // Replace 'token' with your actual key for login state
      // console.log(token)
      if (!token) {
        history.push('/login'); // Redirect to login page if not logged in
      }
    }, [history]);
  useEffect(() => {
    fetch("/stockfood")
      .then((res) => res.json())
      .then((data) => {
        // setProducts(data);
        setProductData(data); // Set the editable product data
      })
      .catch((err) => console.error("Error fetching menu:", err));
  }, []); // Empty dependency array to fetch data only once
  useEffect(() => {
    fetch("/stockgadget")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        // setProductData(data); // Set the editable product data
      })
      .catch((err) => console.error("Error fetching menu:", err));
  }, []);
  //handleInputChangeUnified(product._id, "takeout", e.target.value, "food")
  const handleInputChangeUnified = (id, fieldPath, value, type) => {
    const updateState = (state, setState) => {
      const updated = state.map((item) => {
        if (item._id === id) {
          const updatedItem = { ...item };
          const fields = fieldPath.split(".");
          fields.reduce((acc, key, idx) => {
            if (idx === fields.length - 1) acc[key] = parseInt(value, 10) || 0;
            return acc[key];
          }, updatedItem);
          return updatedItem;
        }
        return item;
      });
      setState(updated);
      console.log("products");
      console.log(products);
      console.log("productdata");
      console.log(productData);
    };
  
    if (type === "food") updateState(productData, setProductData);
    if (type === "gadget") updateState(products, setProducts);
  };
  
  
  const handleSubmitgadget = async () => {
    try {
      const response = await fetch("/updatestock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({productData,products,date: new Date().toISOString().split('T')[0],branchID :branchID}), // Send updated product data to the server
      });

      const result = await response.json();
      if (response.ok) {
        alert("Data successfully updated!");
      } else {
        alert("Error updating data: " + result.message);
      }
    } catch (err) {
      alert("An error occurred while updating data: " + err.message);
    }
  };
  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">จัดการคลังวันที่ {formattedDate}</h1>
      <h2 className="text-2xl text-left font-bold mb-5">คลังอาหาร</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border p-3">ชื่อสินค้า</th>
            <th className="border p-3">หน่วย</th>
            <th className="border p-3">รับเข้า</th>
            <th className="border p-3">ใช้ไป</th>
            <th className="border p-3">ค้าง</th>
            <th className="border p-3">เสีย</th>
            <th className="border p-3">คงเหลือ</th>
            
          </tr>
        </thead>
        <tbody>
          {productData.map((product) => (
            <tr key={product._id}>
              <td className="border p-2">{product.Thainame}</td>
              <td className="border p-2">{product.unit}</td>
              <td className="border p-2">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={product.takein}
                  onChange={(e) =>
                    handleInputChangeUnified(product._id, "takein", e.target.value, "food")
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={product.takeout}
                  onChange={(e) =>
                    handleInputChangeUnified(product._id, "takeout", e.target.value, "food")
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={product.remain}
                  onChange={(e) =>
                    handleInputChangeUnified(product._id, "remain", e.target.value, "food")
                  }
                />
              </td>
              <td className="border p-3">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={product.waste}
                  onChange={(e) =>
                    handleInputChangeUnified(product._id, "waste", e.target.value, "food")
                  }
                />
              </td>
              <td className="border p-3">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={product.final}
                  onChange={(e) =>
                    handleInputChangeUnified(product._id, "final", e.target.value, "food")
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h2 className="text-2xl text-left font-bold mb-5 mt-5">คลังสิ่งของ</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border p-3">ชื่อสินค้า</th>
            <th className="border p-3">หน่วย</th>
            <th className="border p-3">รับเข้า (ลัง)</th>
            <th className="border p-3">ใช้ไป (ลัง)</th>
            <th className="border p-3">ใช้ไป (แพ็ค/ถุง)</th>
            <th className="border p-3">คงเหลือ (ลัง)</th>
            <th className="border p-3">คงเหลือ (แพ็ค/ถุง)</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td className="border p-2">{product.Thainame}</td>
              <td className="border p-2">{product.unit}</td>
              <td className="border p-2">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={product.takein}
                  onChange={(e) =>
                    handleInputChangeUnified(product._id, "takein", e.target.value,"gadget")
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={product.takeout.crate}
                  onChange={(e) =>
                    handleInputChangeUnified(product._id, "takeout.crate", e.target.value,"gadget")
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={product.takeout.pack}
                  onChange={(e) =>
                    handleInputChangeUnified(product._id, "takeout.pack", e.target.value,"gadget")
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={product.remain.crate}
                  onChange={(e) =>
                    handleInputChangeUnified(product._id, "remain.crate", e.target.value,"gadget")
                  }
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  className="border p-2 w-full"
                  value={product.remain.pack}
                  onChange={(e) =>
                    handleInputChangeUnified(product._id, "remain.pack", e.target.value,"gadget")
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     
      <button
        onClick={handleSubmitgadget}
        className="mt-5 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        ยืนยันสต็อค
      </button>
    </div>
  );
};

export default Updatestockstaff;
