"use client";
import React, { useState } from 'react';
import HomeDashboard from "../components/HomeDashboard";
import TableOrders from '../components/TableOrders';
import MenuDashboard from '../components/MenuDashboard';  
import SupplierDashboard from '../components/SupplierDashboard';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('home');

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-xl font-bold">Dashboard</div>
        <ul className="mt-4">
          <li onClick={() => setSelectedTab('home')} className={`p-4 cursor-pointer ${selectedTab === 'home' ? 'bg-gray-700' : ''}`}>Home</li>
          <li onClick={() => setSelectedTab('menu')} className={`p-4 cursor-pointer ${selectedTab === 'menu' ? 'bg-gray-700' : ''}`}>Menu</li>
          <li onClick={() => setSelectedTab('orders')} className={`p-4 cursor-pointer ${selectedTab === 'orders' ? 'bg-gray-700' : ''}`}>Orders</li>
          <li onClick={() => setSelectedTab('supplier')} className={`p-4 cursor-pointer ${selectedTab === 'supplier' ? 'bg-gray-700' : ''}`}>Supplier</li>

        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">

        {selectedTab === 'home' && <HomeDashboard />}

        {selectedTab === 'menu' && <MenuDashboard />} 

        {selectedTab === 'orders' && <TableOrders />}

        {selectedTab === 'supplier' && <SupplierDashboard />}

      </div>
    </div>
  );
};

export default Dashboard;
