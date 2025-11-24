import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Profile from "./Pages/Profile.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Transactions from "./Pages/Transactions.jsx";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./Features/UserSlice.js";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const dispatch = useDispatch();

  const { status } = useSelector((state) => state.user);



  // 🚀 Wait until current user API finishes
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="grid grid-cols-[250px_1fr] h-screen">
        <Sidebar />

        <div className="p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Transactions" element={<Transactions />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
