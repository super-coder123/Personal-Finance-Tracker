import React from 'react'
import { FaBars, FaChartPie, FaUser, FaWallet } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div>
      <aside className="w-64 bg-white  p-5">
              <div className="flex gap-2 items-center shadow-gray-400 text-2xl p-3">
                 <FaBars className="text-2xl"></FaBars>
                 <p className="font-semibold">Menu</p>
              </div>
              <div className="mt-4 space-y-3 ">
                 <div className="flex items-center gap-3  hover:text-blue-600  hover:rounded-2xl w-full p-3">
                        <NavLink to={"/"} className={({ isActive }) =>`text-xl flex items-center gap-3 font-semibold ${isActive ? "text-blue-600 font-semibold" : ""}`}>
                         <FaChartPie></FaChartPie>
                        Dashboard</NavLink>
                 </div>
      
                 <div className="flex items-center gap-3  hover:text-blue-600  hover:rounded-2xl w-full p-3">
                      
                       <NavLink to={"/Transactions"} className={({ isActive }) =>`text-xl flex items-center gap-3 font-semibold ${isActive ? "text-blue-600 font-semibold" : ""}`}>
                         <FaWallet></FaWallet>
                        Transactions</NavLink>
                 </div>
      
                 <div className="flex items-center gap-3  hover:text-blue-600  hover:rounded-2xl w-full p-3">
                        
                       <NavLink to={"/Profile"} className={({ isActive }) =>`text-xl flex items-center gap-3 font-semibold ${isActive ? "text-blue-600 font-semibold" : ""}`}>
                         <FaUser></FaUser>
                        Profile</NavLink>
                 </div>
              </div>
            </aside>
    </div>
  )
}

export default Sidebar
