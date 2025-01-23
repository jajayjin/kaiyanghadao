import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

const Moneysummary = () => {
  const history = useHistory();
  const location = useLocation();
  const intdate = location.state.date;
  const branchname = localStorage.getItem("username");
  const branchid = localStorage.getItem("branchid");
  const datenow = new Date();
  const today = datenow.toISOString().split("T")[0];
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [formattedDate, setFormattedDate] = useState("");
  useEffect(() => {
      const token = localStorage.getItem('authToken'); // Replace 'token' with your actual key for login state
      // console.log(token)
      if (!token) {
        history.push('/login'); // Redirect to login page if not logged in
      }
    }, [history]);
  useEffect(() => {
    fetchproducts(intdate);
    fetchsales(intdate);
  }, [intdate]);

  const totalPrice = products
    .reduce((total, product) => total + product.price * product.quantitySold, 0)
    .toLocaleString();

  const fetchproducts = async (value) => {
    try {
      const response = await fetch("/sellsummary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: value, branchID: branchid }),
      });

      if (response.ok) {
        const searchResults = await response.json();
        setProducts(searchResults.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchsales = async (value) => {
    try {
      const response = await fetch("/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: value, branchID: branchid }),
      });

      if (response.ok) {
        const searchResults = await response.json();
        setSales(searchResults.moneysub);
        setFormattedDate(searchResults.moneysub.date)
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const swithpagetosell = () =>{
    history.push({pathname:`/Sellsummary`, state: {date: today,branchID:branchid }});
  }
  return (
    <div className="bg-white border rounded-lg shadow-lg px-8 py-8 mx-auto mt-8 max-w-5xl">
      <h1 className="font-bold text-3xl my-4 text-center text-blue-600">
        Kaiyang Hadao
      </h1>
      <hr className="mb-6" />
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Invoice Summary</h2>
          <p className="text-sm text-gray-600">Branch: {branchname}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-700">Date: {today}</p>
        </div>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-sm rounded-lg border">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-3">ชื่ออาหาร</th>
              <th className="px-6 py-3 text-center">ราคาต่อชิ้น (บาท)</th>
              <th className="px-6 py-3 text-center">จำนวนที่ขายไป (ชิ้น)</th>
              <th className="px-6 py-3 text-center">ราคารวมที่ขายได้ (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  className="bg-white border-b hover:bg-gray-50"
                  key={product.id}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-center">{product.price}</td>
                  <td className="px-6 py-4 text-center">{product.quantitySold}</td>
                  <td className="px-6 py-4 text-center">
                    {product.quantitySold * product.price}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  ไม่มีผลลัพธ์
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-6 py-4">ยอดขายรวม</td>
              <td></td>
              <td></td>
              <td className="px-6 py-4 text-center">{totalPrice} บาท</td>
            </tr>
            <tr className="bg-gray-200 font-semibold">
              <td className="px-6 py-4">เงิน</td>
              <td></td>
              <td></td>
              <td className="px-6 py-4 text-center">{sales.cash || 0} บาท</td>
            </tr>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-6 py-4">QR</td>
              <td></td>
              <td></td>
              <td className="px-6 py-4 text-center">{sales.qr || 0} บาท</td>
            </tr>
            <tr className="bg-gray-200 font-semibold">
              <td className="px-6 py-4">Lineman</td>
              <td></td>
              <td></td>
              <td className="px-6 py-4 text-center">{sales.lineman || 0} บาท</td>
            </tr>
            <tr className="bg-gray-100 font-semibold">
              <td className="px-6 py-4">Grab</td>
              <td></td>
              <td></td>
              <td className="px-6 py-4 text-center">{sales.grab || 0} บาท</td>
            </tr>
            <tr className="bg-red-100 font-semibold">
              <td className="px-6 py-4 text-red-600">ค่าใช้จ่าย</td>
              <td></td>
              <td></td>
              <td className="px-6 py-4 text-center text-red-600">
                {sales.expense || 0} บาท
              </td>
            </tr>
            <tr className="bg-green-100 font-semibold">
              <td className="px-6 py-4 text-green-600">รายรับคงเหลือ</td>
              <td></td>
              <td></td>
              <td className="px-6 py-4 text-center text-green-600">
                {sales.finalprofit || 0} บาท
              </td>
            </tr>
            <tr className="bg-blue-100 font-semibold">
              <td className="px-6 py-4">เวลาเลิกงาน</td>
              <td></td>
              <td></td>
              <td className="px-6 py-4 text-center">{sales.timeout || 0} น.</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-center">
      
         
        
    <button className="bg-red-600 mt-5 mr-5 text-white py-2 px-2 rounded-lg hover:bg-red-700 transition"  onClick={swithpagetosell}>
    แก้ไขยอดขายประจำวัน
    </button>
    <button className="bg-red-600 mt-5 text-white py-2 px-2 rounded-lg hover:bg-red-700 transition"  >
    ไปที่หน้าดูยอดขาย
    </button>
      </div>
    </div>
  );
};

export default Moneysummary;
