import React from 'react';
import Mockupsales from './Mockupsales';

const Stockformanager = () => {
  return (
    <div className="p-6">

      <p className="font-mono text-2xl mb-5">Stock</p>
      

      <div className="flex flex-wrap gap-4 mt-5">
        {Mockupsales.map((product) => (
          <div
            key={product.id}
            className="bg-white w-60 rounded-lg overflow-hidden shadow-md transform transition hover:scale-105"
          >
         
            <img
              className="w-full h-52 object-cover"
              src={product.photo}
              alt={product.name}
            />
            
     
            <div className="p-4">
              <h5 className="text-xl font-semibold mb-2 text-gray-800">
                {product.name}
              </h5>
            </div>

            <button
              type="button"
              className="w-full text-center bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-full hover:bg-red-800 focus:ring-4 focus:ring-red-300 transition-all"
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stockformanager;
