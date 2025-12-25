import React, { useState } from "react";
import { FaBars, FaChartPie, FaUser, FaWallet } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-white shadow-md transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <button onClick={() => setCollapsed(!collapsed)}>
          <FaBars className="text-2xl" />
        </button>

        {!collapsed && (
          <span className="text-xl font-semibold">Menu</span>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-4 space-y-2">
        <SidebarItem
          to="/"
          icon={<FaChartPie />}
          label="Dashboard"
          collapsed={collapsed}
        />

        <SidebarItem
          to="/Transactions"
          icon={<FaWallet />}
          label="Transactions"
          collapsed={collapsed}
        />

        <SidebarItem
          to="/Profile"
          icon={<FaUser />}
          label="Profile"
          collapsed={collapsed}
        />
      </nav>
    </aside>
  );
};

const SidebarItem = ({ to, icon, label, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 p-3 mx-2 rounded-xl text-lg font-semibold
        hover:bg-gray-100 hover:text-blue-600
        ${isActive ? "bg-gray-100 text-blue-600" : ""}`
      }
    >
      <span className="text-xl">{icon}</span>

      {!collapsed && (
        <span className="whitespace-nowrap">{label}</span>
      )}
    </NavLink>
  );
};

export default Sidebar;
