import React, { useEffect, useState } from 'react';
import { Link, useLocation,useHistory } from 'react-router-dom';

const Sellsummary = () => {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [formattedDate, setFormattedDate] = useState("");
  const location = useLocation();
  const datenow = new Date();
  const today = datenow.toISOString().split("T")[0];
  const [showupcheck, setshowupcheck] = useState(false);
  const [notbalance, setnotbalance] = useState(false);
  const [showupassisbut, setshowupassisbut] = useState(true);
  const [moneysub, setmoneysub] = useState({
    cash: '',
    qr: '',
    lineman: '',
    grab: '',
    totalsum: '',
    expense: '',
    timeout:'',
    finalprofit:''
  });
  let  branchid = "";
  const [dataArray, setDataArray] = useState([]);

  useEffect(() => {
      const token = localStorage.getItem('authToken'); // Replace 'token' with your actual key for login state
      // console.log(token)
      if (!token) {
        history.push('/login'); // Redirect to login page if not logged in
      }
    }, [history]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setDataArray((prev) => [...prev, moneysub]);
    console.log('Submitted Data:', moneysub);
    checkthesales();
  };

  useEffect(() => {
    if (location.state.date && location.state.branchID){
      const intdate = location.state.date;
      branchid = location.state.branchID;
      handledatesubmit(intdate);
    }else{
      console.log(today)
    }
  });
  const handleChange = (event) => {
    const { id, value } = event.target;
    console.log(moneysub)
    // Optional conversion to ensure number type if `type="number"`
    const numericValue = id === 'expense' || id === 'cash' || id === 'qr' || id === 'lineman' || id === 'grab'
      ? Number(value) || ""
      : value;
  
    setmoneysub((prev) => ({
      ...prev,
      [id]: numericValue, // Use numericValue here to avoid type mismatch
    }));
  };
  
  useEffect(() => {
    const total =
      (parseFloat(moneysub.cash) || 0) +
      (parseFloat(moneysub.qr) || 0) +
      (parseFloat(moneysub.lineman) || 0) +
      (parseFloat(moneysub.grab) || 0);
    setmoneysub((prev) => ({
      ...prev,
      totalsum: total.toFixed(2),
    }));
  }, [moneysub.cash, moneysub.qr, moneysub.lineman, moneysub.grab]);
  useEffect(() => {
  const finalprofit2 =
      (parseFloat(moneysub.cash) || 0) +
      (parseFloat(moneysub.qr) || 0) +
      (parseFloat(moneysub.lineman) || 0) +
      (parseFloat(moneysub.grab) || 0) - (parseFloat(moneysub.expense) || 0);
    setmoneysub((prev) => ({
      ...prev,
      finalprofit: finalprofit2.toFixed(2),
    }));
  }, [moneysub.cash, moneysub.qr, moneysub.lineman, moneysub.grab,moneysub.expense]);
  
const totalPrice = products.reduce((total, product) => total + (product.price * product.quantitySold), 0).toLocaleString();
  const handleDateChange = (event) => {
    setFormattedDate(event.target.value);
    handledatesubmit(event.target.value);
  };
  const handleshowupcheck = () => {

    setshowupcheck((prev) => !prev);
    setshowupassisbut((prev) => !prev);
    // console.log(showupcheck);
  };
  // const totalsum = moneysub.cash + moneysub.qr + moneysub.lineman + moneysub.grab;
  const checkthesales = () =>{
    console.log("check1")
    console.log(parseFloat(moneysub.totalsum))
    console.log(parseFloat(totalPrice))
     if (parseFloat(moneysub.totalsum) == parseFloat(totalPrice)){
      console.log("check sales")
      console.log(moneysub.totalsum);
      setnotbalance(false);
      handleSubmitsales();
      setmoneysub({
        cash: '',
        qr: '',
        lineman: '',
        grab: '',
        totalsum: '',
        expense: '',timeout:''
        });
     }else{
      setnotbalance(true);
     }
  }
  const handleSubmitsales = () => {
    // console.log(localStorage.getItem("branchid"))
    console.log("submit sales");
    console.log(moneysub)
    fetch('/submit-money', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        moneysub, 
        branchID: localStorage.getItem("branchid")
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        history.push({pathname:`/Moneysummary`, state: {date: today }});
        alert('ยืนยันยอดขายเรียบร้อย');
      })
      .catch((err) => {
        alert('Error submitting sale.');
      });
  };
  
  const handledatesubmit = async (value) => {
    try {
      const response = await fetch('/sellsummary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: value, branchID: branchid }),
      });

      if (response.ok) {
        const searchResults = await response.json();
        setProducts(searchResults.products);
        setFormattedDate(searchResults.date);
      } else {
        setProducts([]);
        console.error('Search failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center py-10 px-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">เลือกวันที่ต้องการดูผลประกอบการ</h2>
        <div className="flex justify-center items-center mb-4">
          <div className="relative max-w-sm w-full">
            <input
              type="date"
              id="default-datepicker"
              value={formattedDate}
              onChange={handleDateChange}
              className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {formattedDate && (
          <p className="text-lg text-center text-gray-600 mb-5">ยอดขายวันที่ <span className="font-bold text-gray-800 ">{formattedDate}</span></p>
        )}

        <div className="relative overflow-x-auto">
          <table className="w-full text-m text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ชื่ออาหาร
                </th>
                <th scope="col" className="px-6 py-3 ">
                  ราคาต่อชิ้น (บาท)
                </th>
                <th scope="col" className="px-6 py-3 ">
                  จำนวนที่ขายไป (ชิ้น)
                </th>
                <th scope="col" className="px-6 py-3">
                  ราคารวมที่ขายได้ (บาท)
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr className="bg-white dark:bg-gray-800" key={product.id}>
                    <td className="px-6 py-4 font-medium  text-gray-900 whitespace-nowrap dark:text-white">
                      {product.name}
                    </td><td className="px-6 py-4 text-center">{product.price}</td>
                    <td className="px-6 py-4 text-center">{product.quantitySold}</td>
                    <td className="px-6 py-4 text-center">{product.quantitySold*product.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500">ไม่มีผลลัพธ์</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="font-semibold text-gray-900 dark:text-white">
                <th scope="row" className="px-6 py-3 text-base">ยอดขายรวม</th>
                <td className="px-6 py-3">{}</td>
                <td className="px-6 py-3">{totalPrice} บาท</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {showupassisbut  && ( <div classname="flex">
        {formattedDate === today && (
          
            <Link to="/staffproducts">
              <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition mr-5">
                แก้ไขจำนวนที่ขายได้วันนี้
              </button>
            </Link>
        
        )}
     
            
             <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition" onClick={handleshowupcheck} >
                ยืนยันยอดขาย
              </button>
          </div>)}
          {showupcheck  && (
          <div classname="items-center">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 mt-5 ">สรุปรวมยอดขาย {totalPrice} บาท แบ่งเป็นรับเงินจาก</h2><h2 className="text-l font-semibold text-left text-gray-800 mb-6 mt-5 bg-green-100">รายรับ (บาท)</h2>
          <form onSubmit={handleSubmit}>
         <div className="flex flex-wrap">
         
    <label for="cash" class="block mb-2 text-l font-medium text-gray-900 dark:text-white text-left mr-5">เงินสด:</label>
    <input type="text" id="cash" value={moneysub.cash} onChange={handleChange} class="block w-20 p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-5" />
    <label for="qr" class="block mb-2 text-l font-medium text-gray-900 dark:text-white text-left mr-5">QR:</label>
    <input type="text" id="qr" value={moneysub.qr} onChange={handleChange} class="block w-20 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-5"/>
    <label for="lineman" class="block mb-2 text-l font-medium text-gray-900 dark:text-white text-left mr-5">Line Man:</label>
    <input type="text" id="lineman"  value={moneysub.lineman} onChange={handleChange} class="block w-20 p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-5" />
    <label for="grab" class="block mb-2 text-l font-medium text-gray-900 dark:text-white text-left mr-5">Grab:</label>
    <input type="text" id="grab"  value={moneysub.grab} onChange={handleChange} class="block w-20 p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-5"/>
</div>
<h2 className="text-l font-semibold text-left text-gray-800 mb-6 mt-5 bg-red-100">รายจ่าย (บาท)</h2>
         <div className="flex flex-wrap">
         
    <label for="expense" class="block mb-2 text-l font-medium text-gray-900 dark:text-white text-left mr-5">ค่าใช้จ่าย:</label>
    <input type="text" id="expense"  value={moneysub.expense} onChange={handleChange} class="block w-20 p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-5" />

</div><h2 className="text-l font-semibold text-left text-gray-800 mb-6 mt-5 bg-indigo-100">เวลาเลิกงาน (กรอกเป็นเวลาเช่น 20.00)</h2>
<div className="flex flex-wrap">
         
    <label for="timeout" class="block mb-2 text-l font-medium text-gray-900 dark:text-white text-left mr-5">เวลาเลิกงาน:</label>
    <input type="text" id="timeout"  value={moneysub.timeout} onChange={handleChange} class="block w-20 p-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-5" />

</div>
{notbalance && (<div class="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
  <strong class="font-bold">แจ้งเตือน! </strong>
  <span class="block sm:inline">ยอดขายรวมกับรายรับไม่เท่ากัน</span>
  <span class="absolute top-0 bottom-0 right-0 px-4 py-3 ">
    <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
  </span>
</div> )}
<div className="flex flex-wrap items-center justify-center">
{formattedDate === today && (
          
          <Link to="/staffproducts">
            <button className="mt-5 mb-5 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition mr-5">
              แก้ไขจำนวนที่ขายได้วันนี้
            </button>
          </Link>
      
      )}
   
   
           <button className="bg-green-600 text-white py-2 px-2 rounded-lg hover:bg-green-700 transition"  type="submit">
              ยืนยันส่งยอดการขายประจำวัน
            </button>
</div></form>
<div>
      

  
    </div>
</div>)}</div></div>
    
  );
};

export default Sellsummary;
