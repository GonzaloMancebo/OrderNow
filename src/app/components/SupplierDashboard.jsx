import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SupplierDashboard = () => {
  const [supplier, setSupplier] = useState('');
  const [foodType, setFoodType] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Función para registrar un gasto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supplier || !foodType || !amount) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    try {
      if (editingId) {
        // Actualizar un registro existente
        const expenseRef = doc(db, 'supplierExpenses', editingId);
        await updateDoc(expenseRef, {
          supplier,
          foodType,
          amount: parseFloat(amount),
        });
        toast.success('Gasto actualizado correctamente 🎉');
        setEditingId(null);
      } else {
        // Crear un nuevo registro
        await addDoc(collection(db, 'supplierExpenses'), {
          supplier,
          foodType,
          amount: parseFloat(amount),
          date: new Date(),
        });
        toast.success('Gasto registrado correctamente 🎉');
      }

      setSupplier('');
      setFoodType('');
      setAmount('');
      fetchExpenses(); // Actualizar la lista de gastos
    } catch (error) {
      toast.error('Error al registrar el gasto. Intenta de nuevo.');
      console.error("Error agregando gasto: ", error);
    }
  };

  // Función para obtener los gastos desde Firebase
  const fetchExpenses = async () => {
    const snapshot = await getDocs(collection(db, 'supplierExpenses'));
    const expensesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setExpenses(expensesData);
  };

  // Función para eliminar un gasto
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'supplierExpenses', id));
      toast.success('Gasto eliminado correctamente');
      fetchExpenses(); // Actualizar la lista
    } catch (error) {
      toast.error('Error al eliminar el gasto');
      console.error("Error eliminando gasto: ", error);
    }
  };

  // Función para editar un gasto (carga los datos en el formulario)
  const handleEdit = (expense) => {
    setSupplier(expense.supplier);
    setFoodType(expense.foodType);
    setAmount(expense.amount);
    setEditingId(expense.id); // Guardar el ID para saber qué editar
  };

  // useEffect para cargar los gastos al inicio
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">{editingId ? 'Editar Gasto de Proveedor' : 'Registrar Gasto de Proveedor'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Proveedor:</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full p-2 border rounded text-black"
                placeholder="Nombre del Proveedor"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Tipo de Comida:</label>
              <input
                type="text"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                className="w-full p-2 border rounded text-black"
                placeholder="Ejemplo: Carne, Verduras, etc."
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Monto:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded text-black"
                placeholder="Monto en USD"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Actualizar Gasto' : 'Registrar Gasto'}
            </button>
          </form>

        
        </div>

        {/* Lista de gastos */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Gastos Registrados</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 text-black">Proveedor</th>
                <th className="py-2 text-black" >Tipo de Comida</th>
                <th className="py-2 text-black">Monto</th>
                <th className="py-2 text-black">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="border px-4 py-2 text-black">{expense.supplier}</td>
                  <td className="border px-4 py-2 text-black">{expense.foodType}</td>
                  <td className="border px-4 py-2 text-black">${expense.amount.toFixed(2)}</td>
                  <td className="border px-4 py-2 text-black">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 hover:bg-yellow-700"
                      onClick={() => handleEdit(expense)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                      onClick={() => handleDelete(expense.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Componente Toast para las notificaciones */}
      <ToastContainer />
    </div>
  );
};

export default SupplierDashboard;
