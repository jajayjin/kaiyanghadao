import React, { useState, useEffect } from 'react';
import { Link,useHistory,useLocation } from 'react-router-dom';
const Staffpage = () => {
  const history = useHistory();
  const [products, setProducts] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [Namesearch, setNamesearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [Category, setCategory] = useState('');
  const [label, setlabel] = useState('');
  const branchID= localStorage.getItem("branchid");
  const menu = [
    { label: 'ไก่ย่าง', value: 'Kaiyang' },
    { label: 'ไก่ทอด', value: 'Kaitod' },
    { label: 'ของทานเล่น', value: 'Snack' },
    { label: 'เครื่องดื่ม', value: 'Beverage' },
    { label: 'เป็ด', value: 'Duckmenu' },
    { label: 'ซอส', value: 'Sauce' },
    { label: 'ทุกหมวด', value: 'All' }
  ];
  const categoryLabels = menu.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Replace 'token' with your actual key for login state
    // console.log(token)
    if (!token) {
      history.push('/login'); // Redirect to login page if not logged in
    }
  }, [history]);
  useEffect(() => {
    fetch('/menu')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const initialCounts = data.reduce((acc, product) => {
          acc[product.id] = 0;
          return acc;
        }, {});
        setProductCounts(initialCounts);
      })
      .catch((err) => console.error('Error fetching menu:', err));
      
  }, []);

  const handleIncrement = (productId) => {
    setProductCounts((prevCounts) => ({
      ...prevCounts,
      [productId]: prevCounts[productId] + 1,
    }));
  };
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});
  const handleDecrement = (productId) => {
    setProductCounts((prevCounts) => ({
      ...prevCounts,
      [productId]: Math.max(0, prevCounts[productId] - 1),
    }));
  };

  const handleSubmit = (date) => {
    // console.log(localStorage.getItem("branchid"))
    console.log('Payload being sent:', {
      date: new Date().toISOString().split('T')[0],
      productCounts,
      branchID: localStorage.getItem('branchid'),
  });
    fetch('/submit-sale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        productCounts,
        branchID: localStorage.getItem("branchid"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        history.push({pathname:`/Sellsummary`, state: {date: new Date().toISOString().split('T')[0],branchID :branchID  }});
        alert('Sale submitted successfully!');
      })
      .catch((err) => {
        alert('Error submitting sale.');
      });
  };
  const handlecategory = async (value) => {
    // event.preventDefault();
    try {
      const response = await fetch('/seachbydropdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Category : value}),
      });
      if (response.ok) {
        const searchResults = await response.json();
        setProducts(searchResults);
      } else {
        console.error('Search failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(event.target);
    const inputName = formData.get('name').trim(); // Get the search input and trim spaces
    setCategory(null)
    console.log(Category)
    if (!inputName) {
      // If the input is empty, fetch all products
      try {
        const response = await fetch('/menu'); // Fetch all products endpoint
        if (response.ok) {
          const allProducts = await response.json();
          setProducts(allProducts);
          console.log('Fetched all products:', allProducts); // Debugging log
        } else {
          console.error('Failed to fetch all products');
        }
      } catch (error) {
        console.error('Error fetching all products:', error);
      }
      return;
    }
  
    // Handle normal search query
    try {
      const response = await fetch('/seachproductstaff', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Namesearch: inputName }),
      });
  
      if (response.ok) {
        const searchResults = await response.json();
        setProducts(searchResults);
        console.log('Search results:', searchResults);
      } else {
        console.error('Search failed');
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };
  
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectCategory = ([value, label]) => {
    setCategory(value);
    setlabel(label)
    setIsOpen(false); // Close dropdown
    handlecategory(value);
    console.log(`Selected Category: ${value}`);
  };

  const now = new Date();
  const formattedDate = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <form onSubmit={handleSearch} className="max-w-md mx-auto mt-5">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            name="name"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ค้นหาชื่อเมนูหรือเลือกหมวดหมู่อาหารด้านล่าง"
            onChange={(e) => setNamesearch(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            ค้นหา
          </button>
        </div>
      </form>

      <div className="relative inline-block mt-5">
        <button
          onClick={toggleDropdown}
          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          เลือกหมวดหมู่
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        
        {isOpen && (
          <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-2">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {menu.map((item) => (
                <li key={item.value}>
                  <button
                    onClick={() => handleSelectCategory([item.value,item.label])}
                    className="block px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {Category && (
        <p className="text-center mt-3 text-xl">
          หมวดหมู่ที่เลือก: <span className="font-semibold">{label}</span>
        </p>
      )}
      <p className="text-center text-72xl mt-5">จำนวนที่ขายได้ใน {formattedDate}</p>
      <div className="flex flex-wrap gap-4 justify-center">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white w-75 h-75 mt-5 rounded-lg overflow-hidden shadow-md"
            >
              <div className="p-4 text-left">
                <h5 className="text-xl font-semibold mb-2">{product.Thainame}</h5>
                <h5 className="text-xl font-semibold mb-2">ราคาต่อชิ้น: {product.price} บาท</h5>
              </div>
              <p className="mt-5 mb-3">จำนวนที่ขาย: {productCounts[product.id]}</p>
             
              <button
                type="button"
                onClick={() => handleDecrement(product.id)}
                className="focus:outline-none bg-red-700 rounded-full text-center text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 mt-3"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleIncrement(product.id)}
                className="focus:outline-none bg-red-700 rounded-full text-center text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                +
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">No products available</p>
        )}
      </div>
     
      <button
        onClick={() => handleSubmit(now)}
        className="mt-5 px-4 py-2 bg-red-700 text-white rounded-lg mb-5"
      >
        Submit Sales
      </button>
     
  
    </div>
  );
};

export default Staffpage;
