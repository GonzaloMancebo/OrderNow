"use client";
import React, { useState } from 'react';
import OrderForm from '../components/OrderForm';
import { ToastContainer } from 'react-toastify'; // Asegúrate de importar el ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toast

const Main = () => {
  const [tables, setTables] = useState(
    Array.from({ length: 10 }, (_, i) => ({ number: i + 1, isOccupied: false }))
  );
  const [selectedTable, setSelectedTable] = useState(null);
  const [hoveredTable, setHoveredTable] = useState(null); // Estado para la mesa "hovered"

  const handleTableClick = (tableNumber) => {
    setSelectedTable(tableNumber); // Solo se selecciona la mesa, no se marca como ocupada aquí
  };

  const handleMarkTableOccupied = (tableNumber) => {
    // Marcar mesa como ocupada solo cuando el pedido se envía
    setTables(tables.map(table =>
      table.number === tableNumber ? { ...table, isOccupied: true } : table
    ));
  };

  const handleCloseTable = (tableNumber) => {
    setTables(tables.map(table =>
      table.number === tableNumber ? { ...table, isOccupied: false } : table
    ));
    setSelectedTable(null);
  };

  const handleOpenOrderForm = () => {
    setSelectedTable(null);
  };

  return (
    <div className="p-8">
      <ToastContainer /> {/* Agrega el ToastContainer aquí */}
      {selectedTable === null ? (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-6">Mesas</h3>
          <div className="grid grid-cols-5 gap-4">
            {tables.map(table => (
              <div
                key={table.number}
                className={`w-24 h-24 flex items-center justify-center text-white font-bold text-xl 
                  cursor-pointer transition-transform transform hover:scale-110 
                  rounded-lg shadow-lg ${table.isOccupied ? 'bg-red-600' : 'bg-green-600'} 
                  relative flex-col`}  
                onClick={() => handleTableClick(table.number)} // Solo selecciona la mesa
                onMouseEnter={() => table.isOccupied && setHoveredTable(table.number)}
                onMouseLeave={() => table.isOccupied && setHoveredTable(null)}
                style={{ position: 'relative' }}
              >
                {table.number}
                {table.isOccupied && hoveredTable === table.number && (
                  <button
                    onClick={() => handleCloseTable(table.number)}
                    className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white py-1 px-2 rounded-lg mt-2 mx-4"
                  >
                    Cerrar Cuenta
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <OrderForm
          tableNumber={selectedTable}
          onClose={handleOpenOrderForm}
          markTableOccupied={handleMarkTableOccupied}
        />
      )}
    </div>
  );
};

export default Main;
