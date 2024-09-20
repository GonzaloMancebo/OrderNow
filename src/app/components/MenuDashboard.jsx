"use client";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';

const MenuDashboard = () => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('starters');
  const [menuOptions, setMenuOptions] = useState({
    starters: [],
    mainCourses: [],
    desserts: [],
    drinks: []
  });

  // Cargar los datos del menú desde Firestore
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuRef = doc(db, 'menu', 'options');
        const docSnap = await getDoc(menuRef);
        if (docSnap.exists()) {
          setMenuOptions(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching menu: ", error);
      }
    };

    fetchMenu();
  }, []);

  const handleAddItem = async () => {
    if (newItemName.trim() && newItemPrice.trim() && selectedCategory) {
      const newItem = {
        name: newItemName,
        price: parseFloat(newItemPrice),
      };
      const updatedMenu = {
        ...menuOptions,
        [selectedCategory]: [...menuOptions[selectedCategory], newItem],
      };
      setMenuOptions(updatedMenu);

      try {
        // Guardar el menú actualizado en Firestore
        const menuRef = doc(db, 'menu', 'options');
        await setDoc(menuRef, updatedMenu);
        setNewItemName('');
        setNewItemPrice('');
      } catch (error) {
        console.error("Error adding item: ", error);
      }
    }
  };

  const handleRemoveItem = async (category, itemName) => {
    const updatedMenu = {
      ...menuOptions,
      [category]: menuOptions[category].filter(item => item.name !== itemName),
    };
    setMenuOptions(updatedMenu);

    try {
      // Guardar el menú actualizado en Firestore
      const menuRef = doc(db, 'menu', 'options');
      await setDoc(menuRef, updatedMenu);
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Editar Menú</h2>

      <div className="mb-6">
        <h3 className="font-bold mb-2 text-gray-900">Agregar Nuevo Plato</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 mb-2 text-gray-800"
        >
          {['starters', 'mainCourses', 'desserts', 'drinks'].map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="border p-2 mr-2 text-gray-800"
          placeholder="Nombre del plato"
        />
        <input
          type="number"
          value={newItemPrice}
          onChange={(e) => setNewItemPrice(e.target.value)}
          className="border p-2 mr-2 text-gray-800"
          placeholder="Precio"
          step="0.01"
        />
        <button onClick={handleAddItem} className="bg-blue-600 text-white px-4 py-2 rounded">Agregar</button>
      </div>

      {['starters', 'mainCourses', 'desserts', 'drinks'].map(category => (
        <div key={category} className="mb-6">
          <h3 className="font-bold capitalize mb-2 text-gray-900">{category}</h3>
          <ul>
            {menuOptions[category].map((item, index) => (
              <li key={index} className="flex justify-between items-center border-b py-2">
                <div className="text-gray-800">
                  <div>{item.name}</div>
                  <div>{item.price} USD</div>
                </div>
                <button onClick={() => handleRemoveItem(category, item.name)} className="text-red-600">Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MenuDashboard;
