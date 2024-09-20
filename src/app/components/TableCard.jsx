import React from 'react';

const TableCard = ({ tableNumber, onClick }) => {
  return (
    <div
      className="w-48 h-48 flex items-center justify-center bg-white shadow-lg rounded-lg border border-gray-300 cursor-pointer transform hover:scale-105 transition-transform duration-300"
      onClick={() => onClick(tableNumber)}
    >
      <div className="text-xl font-semibold text-gray-800">Mesa {tableNumber}</div>
    </div>
  );
};

export default TableCard;
