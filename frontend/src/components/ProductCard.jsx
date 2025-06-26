import React from 'react';

export const ProductCard = ({ product }) => {
  return (
    <div className="flex flex-col p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      {product.description && (
        <p className="text-gray-600 mb-2">{product.description}</p>
      )}
      <div className="mt-auto flex justify-between items-center">
        <span className="text-lg font-bold">{product.price}</span>
        <button className="text-blue-600 hover:text-blue-800">Ver detalhes</button>
      </div>
    </div>
  );
};
