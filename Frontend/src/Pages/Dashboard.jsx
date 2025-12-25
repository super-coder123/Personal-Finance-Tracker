import React from "react";
import Profile from './Profile.jsx'
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaUserCircle,FaUser,FaBars, FaWallet, FaMoneyBillWave, FaChartPie } from "react-icons/fa";

const Dashboard = () => {
  const navigate=useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const fullname = useSelector((state) => state.user.fullname);
  const transactions = useSelector((state) => state.user.transactions);
  
  

  const COLORS = ["#22c55e", "#ef4444"]; // Green / Red

   const budgets=useSelector((state) => state.user.budgets);
  // console.log(budgets);
  // const budgets = [
  //   { category: "Food", spent: 2200, limit: 3000 },
  //   { category: "Transport", spent: 800, limit: 1500 },
  // ];

 
  const handleprofileclick =() =>{
       if(isLoggedIn)
         {
          navigate("/Profile");
         }
        else
           navigate("/register");
  }
  
const { totalIncome, totalExpense } = transactions.reduce(
  (acc, t) => {
    if (t.type === "income") acc.totalIncome += t.amount;
    else acc.totalExpense += t.amount;
    return acc;
  },
  { totalIncome: 0, totalExpense: 0 }
);

const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpense },
  ];

  

  return (
    <div className="min-h-screen w-full rounded-xl bg-gray-100 flex">
      <main className="flex-1 p-6">
          {/* header */}
          <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          
          <button onClick={handleprofileclick}>
            <div className="flex items-center space-x-3 bg-white p-2 rounded-lg shadow">
             <FaUserCircle className="text-4xl text-gray-600" />
             <p className="font-semibold">{fullname}</p>
            </div>
          </button>
         </div>


         <div className="grid grid-cols-3 gap-6 mt-8">
           <div className="bg-white shadow p-6 rounded-xl flex items-center space-x-4">
            <FaWallet className="text-4xl text-green-600" />
            <div>
              <p className="text-gray-600">Total Income</p>
              <h2 className="text-2xl font-bold">₹ {totalIncome.toLocaleString()}</h2>
            </div>
          </div>


          <div className="bg-white shadow p-6 rounded-xl flex items-center space-x-4">
            <FaMoneyBillWave className="text-4xl text-red-500" />
            <div>
              <p className="text-gray-600">Total Expenses</p>
              <h2 className="text-2xl font-bold">₹ {totalExpense.toLocaleString()}</h2>
            </div>
          </div>


           <div className="bg-white shadow p-6 rounded-xl flex items-center space-x-4">
            <FaChartPie className="text-4xl text-blue-500" />
            <div>
              <p className="text-gray-600">Available Balance</p>
              <h2 className="text-2xl font-bold">
                ₹ {(totalIncome - totalExpense).toLocaleString()}
              </h2>
            </div>
          </div>

         </div>
         

           {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mt-8">

          {/* Pie Chart */}
          <div className="bg-white p-6 shadow rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Income vs Expense Chart</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
    

       {/* Budget Progress */}
          <div className="bg-white p-6 shadow rounded-xl h-[392px] overflow-y-scroll">
            <h3 className="text-xl font-semibold mb-4">Budget Progress</h3>

            {budgets.map((b, i) => {
              const percent = (b.spent / b.limit) * 100;
              return (
                <div key={i} className="mb-6">
                  <p className="font-semibold">
                    {b.category} — ₹{b.spent} / ₹{b.limit}
                  </p>
                  <div className="w-full bg-gray-200 h-3 rounded-full mt-1">
                    <div
                      className={`h-3 rounded-full ${
                        percent < 70
                          ? "bg-green-500"
                          : percent < 100
                          ? "bg-yellow-400"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        
        </div>


        
        {/* Recent Transactions */}
        <div className="bg-white p-6 shadow rounded-xl mt-10">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {transactions.slice(-3).reverse().map((t, i) => (
                <tr key={i} className="border-b text-gray-700">
                  <td className="py-2">{new Date(t.date).toLocaleDateString("en-IN")}</td>
                  <td className={t.type === "income" ? "text-green-600" : "text-red-500"}>
                    {t.type}
                  </td>
                  <td>{t.category}</td>
                  <td>₹ {t.amount}</td>
                  <td>{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       
      </main>
    </div>
  );
};

export default Dashboard;
