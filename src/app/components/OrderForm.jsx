"use client";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { Timestamp } from 'firebase/firestore'; // Importa Timestamp
import { toast } from 'react-toastify'; // Importa toast

const OrderForm = ({ tableNumber, onClose, markTableOccupied }) => {
  const [orders, setOrders] = useState([{ starter: [], mainCourse: [], dessert: [], drink: [], comments: "" }]);
  const [menuOptions, setMenuOptions] = useState({ starters: [], mainCourses: [], desserts: [], drinks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuOptions = async () => {
      try {
        const menuDoc = doc(db, 'menu', 'options');
        const menuSnapshot = await getDoc(menuDoc);

        if (menuSnapshot.exists()) {
          const data = menuSnapshot.data();
          setMenuOptions({
            starters: data.starters || [],
            mainCourses: data.mainCourses || [],
            desserts: data.desserts || [],
            drinks: data.drinks || []
          });
        } else {
          setError("No se pudo cargar el menú. Inténtelo de nuevo.");
        }
      } catch (err) {
        console.error("Error al obtener el menú: ", err);
        setError("No se pudo cargar el menú. Inténtelo de nuevo.");
      }
    };

    fetchMenuOptions();
  }, []);

  const handleCheckboxChange = (index, field, option) => {
    const newOrders = [...orders];
    const selectedOptions = newOrders[index][field];

    const existingOptionIndex = selectedOptions.findIndex(o => o.name === option.name);

    if (existingOptionIndex !== -1) {
      const updatedOption = { ...selectedOptions[existingOptionIndex], quantity: selectedOptions[existingOptionIndex].quantity + 1 };
      selectedOptions[existingOptionIndex] = updatedOption;
    } else {
      newOrders[index][field] = [...selectedOptions, { ...option, quantity: 1 }];
    }

    setOrders(newOrders);
  };

  const handleDecrement = (index, field, option) => {
    const newOrders = [...orders];
    const selectedOptions = newOrders[index][field];

    const existingOptionIndex = selectedOptions.findIndex(o => o.name === option.name);

    if (existingOptionIndex !== -1) {
      const updatedOption = { ...selectedOptions[existingOptionIndex], quantity: selectedOptions[existingOptionIndex].quantity - 1 };

      if (updatedOption.quantity <= 0) {
        newOrders[index][field] = selectedOptions.filter(o => o.name !== option.name);
      } else {
        selectedOptions[existingOptionIndex] = updatedOption;
      }

      setOrders(newOrders);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      for (const order of orders) {
        await addDoc(collection(db, 'orders'), {
          tableNumber,
          ...order,
          date: Timestamp.now(),
        });
      }
      markTableOccupied(tableNumber);
      toast.success('Órdenes enviadas con éxito! 🎉'); // Usar toast en lugar de alert
      onClose();
    } catch (err) {
      console.error("Error al enviar la orden: ", err);
      setError("No se pudo enviar la orden. Inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-black">Comandas para Mesa {tableNumber}</h2>
        <form onSubmit={handleSubmit}>
          {orders.map((order, index) => (
            <div key={index} className="mb-6 border-b pb-4">
              {/* Entradas */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Entradas</label>
                {menuOptions.starters.length > 0 ? (
                  menuOptions.starters.map(option => {
                    const selectedOption = order.starter.find(o => o.name === option.name);
                    const quantity = selectedOption ? selectedOption.quantity : 0;

                    return (
                      <div key={option.name} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleDecrement(index, 'starter', option)}
                          className="mr-2 bg-gray-300 px-2 py-1 rounded"
                          disabled={quantity <= 0}
                        >
                          -
                        </button>
                        <input
                          type="checkbox"
                          id={`starter-${option.name}-${index}`}
                          checked={selectedOption ? true : false}
                          onChange={() => handleCheckboxChange(index, 'starter', option)}
                          className="mr-2"
                        />
                        <label htmlFor={`starter-${option.name}-${index}`} className="ml-2 text-gray-700">
                          {option.name} - ${option.price} {quantity > 0 && `x ${quantity}`}
                        </label>
                      </div>
                    );
                  })
                ) : <p>No hay entradas disponibles.</p>}
              </div>

              {/* Platos principales */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Platos principales</label>
                {menuOptions.mainCourses.length > 0 ? (
                  menuOptions.mainCourses.map(option => {
                    const selectedOption = order.mainCourse.find(o => o.name === option.name);
                    const quantity = selectedOption ? selectedOption.quantity : 0;

                    return (
                      <div key={option.name} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleDecrement(index, 'mainCourse', option)}
                          className="mr-2 bg-gray-300 px-2 py-1 rounded"
                          disabled={quantity <= 0}
                        >
                          -
                        </button>
                        <input
                          type="checkbox"
                          id={`mainCourse-${option.name}-${index}`}
                          checked={selectedOption ? true : false}
                          onChange={() => handleCheckboxChange(index, 'mainCourse', option)}
                          className="mr-2"
                        />
                        <label htmlFor={`mainCourse-${option.name}-${index}`} className="ml-2 text-gray-700">
                          {option.name} - ${option.price} {quantity > 0 && `x ${quantity}`}
                        </label>
                      </div>
                    );
                  })
                ) : <p>No hay platos principales disponibles.</p>}
              </div>

              {/* Postres */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Postres</label>
                {menuOptions.desserts.length > 0 ? (
                  menuOptions.desserts.map(option => {
                    const selectedOption = order.dessert.find(o => o.name === option.name);
                    const quantity = selectedOption ? selectedOption.quantity : 0;

                    return (
                      <div key={option.name} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleDecrement(index, 'dessert', option)}
                          className="mr-2 bg-gray-300 px-2 py-1 rounded"
                          disabled={quantity <= 0}
                        >
                          -
                        </button>
                        <input
                          type="checkbox"
                          id={`dessert-${option.name}-${index}`}
                          checked={selectedOption ? true : false}
                          onChange={() => handleCheckboxChange(index, 'dessert', option)}
                          className="mr-2"
                        />
                        <label htmlFor={`dessert-${option.name}-${index}`} className="ml-2 text-gray-700">
                          {option.name} - ${option.price} {quantity > 0 && `x ${quantity}`}
                        </label>
                      </div>
                    );
                  })
                ) : <p>No hay postres disponibles.</p>}
              </div>

              {/* Bebidas */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Bebidas</label>
                {menuOptions.drinks.length > 0 ? (
                  menuOptions.drinks.map(option => {
                    const selectedOption = order.drink.find(o => o.name === option.name);
                    const quantity = selectedOption ? selectedOption.quantity : 0;

                    return (
                      <div key={option.name} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleDecrement(index, 'drink', option)}
                          className="mr-2 bg-gray-300 px-2 py-1 rounded"
                          disabled={quantity <= 0}
                        >
                          -
                        </button>
                        <input
                          type="checkbox"
                          id={`drink-${option.name}-${index}`}
                          checked={selectedOption ? true : false}
                          onChange={() => handleCheckboxChange(index, 'drink', option)}
                          className="mr-2"
                        />
                        <label htmlFor={`drink-${option.name}-${index}`} className="ml-2 text-gray-700">
                          {option.name} - ${option.price} {quantity > 0 && `x ${quantity}`}
                        </label>
                      </div>
                    );
                  })
                ) : <p>No hay bebidas disponibles.</p>}
              </div>

              {/* Comentarios */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Comentarios</label>
                <textarea
                  value={order.comments}
                  onChange={(e) => {
                    const newOrders = [...orders];
                    newOrders[index].comments = e.target.value;
                    setOrders(newOrders);
                  }}
                  className="border p-2 w-full"
                  rows="3"
                />
              </div>
            </div>
          ))}

          {/* Botón de cancelar */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default OrderForm;
