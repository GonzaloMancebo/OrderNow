"use client";
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Timestamp } from 'firebase/firestore';

const HomeDashboard = () => {
  const [dailyIncome, setDailyIncome] = useState({});
  const [dailyExpenses, setDailyExpenses] = useState({}); // Estado para gastos diarios

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        const snapshot = await getDocs(ordersRef);
        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log("Órdenes obtenidas:", ordersData); 
        calculateDailyIncome(ordersData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const expensesRef = collection(db, 'supplierExpenses');
        const snapshot = await getDocs(expensesRef);
        const expensesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log("Gastos de proveedores obtenidos:", expensesData);
        calculateDailyExpenses(expensesData);
      } catch (error) {
        console.error("Error fetching supplier expenses: ", error);
      }
    };

    fetchOrders();
    fetchExpenses();
  }, []);

  const calculateDailyIncome = (ordersData) => {
    const income = {};
    
    for (const order of ordersData) {
      const date = order.date instanceof Timestamp ? order.date.toDate() : new Date(order.date);
      const formattedDate = date.toLocaleDateString('es-ES'); 
  
      // Calcular ingresos de bebidas
      if (Array.isArray(order.drink)) {
        for (const drink of order.drink) {
          const totalPrice = parseFloat(drink.price) * parseInt(drink.quantity, 10);
          income[formattedDate] = (income[formattedDate] || 0) + totalPrice;
        }
      }
  
      // Calcular ingresos de entrantes
      if (Array.isArray(order.starter)) {
        for (const starter of order.starter) {
          const totalPrice = parseFloat(starter.price) * parseInt(starter.quantity, 10);
          income[formattedDate] = (income[formattedDate] || 0) + totalPrice;
        }
      }
  
      // Calcular ingresos de platos principales
      if (Array.isArray(order.mainCourse)) {
        for (const mainCourse of order.mainCourse) {
          const totalPrice = parseFloat(mainCourse.price) * parseInt(mainCourse.quantity, 10);
          income[formattedDate] = (income[formattedDate] || 0) + totalPrice;
        }
      }
  
      // Calcular ingresos de postres
      if (Array.isArray(order.dessert)) {
        for (const dessert of order.dessert) {
          const totalPrice = parseFloat(dessert.price) * parseInt(dessert.quantity, 10);
          income[formattedDate] = (income[formattedDate] || 0) + totalPrice;
        }
      }
    }
  
    console.log("Ingresos diarios calculados:", income);
    setDailyIncome(income);
  };

  const calculateDailyExpenses = (expensesData) => {
    const expenses = {};

    for (const expense of expensesData) {
      const date = expense.date instanceof Timestamp ? expense.date.toDate() : new Date(expense.date);
      const formattedDate = date.toLocaleDateString('es-ES');

      expenses[formattedDate] = (expenses[formattedDate] || 0) + parseFloat(expense.amount);
    }

    console.log("Gastos diarios calculados:", expenses);
    setDailyExpenses(expenses);
  };

  const data = {
    labels: Object.keys(dailyIncome), // Se usa las fechas de los ingresos, pero se pueden combinar con las de gastos
    datasets: [
      {
        label: 'Ingresos Comandas',
        data: Object.values(dailyIncome),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        barThickness: 80, 
      },
      {
        label: 'Gastos de Proveedores',
        data: Object.keys(dailyIncome).map(date => dailyExpenses[date] || 0), // Mostrar los gastos correspondientes a las mismas fechas
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        barThickness: 80,
      }
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        title: {
          display: true,
          color: '#4B5563',
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#4B5563',
        },
      },
    },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-9">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Bienvenido al Dashboard</h2>
          <div className="mt-6" style={{ height: '500px', position: 'relative' }}>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Ingresos y Gastos Diarios</h3>
            <Bar data={data} options={options} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
