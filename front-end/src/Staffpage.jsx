import React from 'react';
import Mockupsales from './Mockupsales';

const Staffpage = () => {
  return (
    <div className="flex space-x-4">

      {Mockupsales.map((product) => (
        <button key={product.id}>
          <div className="bg-white max-w-m h-full mt-5 rounded-lg overflow-hidden shadow-md">
            <img
              className="w-52 h-52 object-cover object-center"
              src={product.photo}
              alt={product.name}
            />
            <div className="p-4 text-left">
              <h5 className="text-xl font-semibold mb-2">{product.name}</h5>
            </div>
            <button type="button" class="focus:outline-none bg-red-700 rounded-full text-center text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium  text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">+</button>
          </div>
          
        </button>
      ))}
    </div>
  );
};

export default Staffpage;
