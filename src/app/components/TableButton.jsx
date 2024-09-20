"use client";

const TableButton = ({ tableNumber, onClick }) => (
  <button
    onClick={() => onClick(tableNumber)}
    className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition"
  >
    Mesa {tableNumber}
  </button>
);

export default TableButton;
