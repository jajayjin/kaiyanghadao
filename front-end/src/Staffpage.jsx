import React, { useState, useEffect } from 'react';

const Staffpage = () => {
  const [products, setProducts] = useState([]);
  const [productCounts, setProductCounts] = useState({});

  useEffect(() => {
    fetch('/menu')
      .then((res) => res.json())
      .then((data) => {
        console.log('Received data:', data); // Log fetched data
        setProducts(data);

        // Initialize counts to 0 for each product
        const initialCounts = data.reduce((acc, product) => {
          acc[product.id] = 0; // Initialize product count to 0
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
  const handleDecrement = (productId) => {
    setProductCounts((prevCounts) => ({
      ...prevCounts,
      [productId]: prevCounts[productId] - 1,
    }));
  };
  const handleSubmit = () => {
    // Send the product counts to the backend (e.g., to update the database)
    fetch('/submit-sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productCounts), // Send product counts as JSON
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Sale submitted successfully:', data);
        alert('Sale submitted successfully!');
      })
      .catch((err) => {
        console.error('Error submitting sale:', err);
        alert('Error submitting sale.');
      });
  };

  const now = new Date();
  const formattedDate = now.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <p className="text-center text-40xl mt-5">จำนวนที่ขายได้ใน {formattedDate}</p>
      <div className="flex flex-wrap gap-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white w-52 h-52 mt-5 rounded-lg overflow-hidden shadow-md">
              <div className="p-4 text-left">
                <h5 className="text-xl font-semibold mb-2">{product.name}</h5>
              </div>
              <p>จำนวนที่ขาย: {productCounts[product.id]}</p>
              <button
                type="button"
                onClick={() => handleDecrement(product.id)} // Increment the count when clicked
                className="focus:outline-none bg-red-700 rounded-full text-center text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => handleIncrement(product.id)} // Increment the count when clicked
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
        onClick={handleSubmit}
        className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Submit Sales
      </button>
    </div>
  );
};

export default Staffpage;
