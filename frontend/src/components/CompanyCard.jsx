import React from 'react';

export const CompanyCard = ({ company }) => {
  return (
    <div className="flex flex-col p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
      {company.description && (
        <p className="text-gray-600 mb-2">{company.description}</p>
      )}
      <div className="mt-auto flex justify-between items-center">
        <span className="text-sm text-gray-500">{company.location}</span>
        <button className="text-blue-600 hover:text-blue-800">Ver detalhes</button>
      </div>
    </div>
  );
};
