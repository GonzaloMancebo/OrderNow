"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';

const TableOrders = () => {
  const [ordersByTable, setOrdersByTable] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Formato yyyy-MM-dd
  });

  const [preparedItems, setPreparedItems] = useState({}); // Estado para guardar qué ítems están preparados

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrdersByTable(JSON.parse(savedOrders));
    } else {
      fetchOrders(selectedDate);
    }
  }, [selectedDate]);

  const fetchOrders = async (date) => {
    try {
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const selectedDateObject = new Date(date);
      const selectedDateString = formatDate(selectedDateObject); // Formato "DD de Mes de YYYY"
  
      const filteredOrders = orders.filter(order => {
        if (order.date) {
          const orderDateObject = order.date.toDate(); // Convertir Timestamp a Date
          const orderDateString = formatDate(orderDateObject);
          return orderDateString === selectedDateString;
        }
        return false;
      });
  
      const groupedOrders = filteredOrders.reduce((acc, order) => {
        if (!acc[order.tableNumber]) {
          acc[order.tableNumber] = [];
        }
        acc[order.tableNumber].push(order);
        return acc;
      }, {});
  
      setOrdersByTable(groupedOrders);
      localStorage.setItem('orders', JSON.stringify(groupedOrders));
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };
  

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = getMonthName(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
  };

  const getMonthName = (month) => {
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return months[month - 1];
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setSelectedDate(dateValue);
    fetchOrders(dateValue);
  };

  // Función para marcar un ítem como preparado
  const togglePrepared = (tableNumber, itemName) => {
    setPreparedItems(prevState => ({
      ...prevState,
      [tableNumber]: {
        ...prevState[tableNumber],
        [itemName]: !prevState[tableNumber]?.[itemName] // Alterna el estado del ítem
      }
    }));
  };

  // Modificación para incluir cantidad y estado preparado
  const renderItems = (items, tableNumber) => {
    if (!items || items.length === 0) return 'N/A';

    return items.map(item => {
      const isPrepared = preparedItems[tableNumber]?.[item.name] || false;
      return (
        <div key={item.name} className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={isPrepared}
            onChange={() => togglePrepared(tableNumber, item.name)}
            className="mr-2"
          />
          <span className={isPrepared ? 'line-through' : ''}>
            {item.name} x {item.quantity || 1}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Comandas</h2>
      <div className="mb-4">
        <label htmlFor="order-date" className="block text-sm font-medium text-gray-700">Seleccionar Fecha:</label>
        <input
          type="date"
          id="order-date"
          value={selectedDate}
          onChange={handleDateChange}
          className="mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      {Object.keys(ordersByTable).length === 0 ? (
        <p>No hay órdenes disponibles para la fecha seleccionada.</p>
      ) : (
        Object.keys(ordersByTable).map(tableNumber => (
          <div key={tableNumber} className="mb-6 text-black">
            <h3 className="text-lg font-bold mb-2">Mesa {tableNumber}</h3>
            <ul>
              {ordersByTable[tableNumber].map((order, index) => (
                <li key={index} className="border-b py-2">
                  <div><strong>Entradas:</strong> {renderItems(order.starter, tableNumber)}</div>
                  <div><strong>Platos Principales:</strong> {renderItems(order.mainCourse, tableNumber)}</div>
                  <div><strong>Postres:</strong> {renderItems(order.dessert, tableNumber)}</div>
                  <div><strong>Bebidas:</strong> {renderItems(order.drink, tableNumber)}</div>
                  <div><strong>Comentarios:</strong> {order.comments || 'N/A'}</div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default TableOrders;
