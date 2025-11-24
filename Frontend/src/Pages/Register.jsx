import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, clearError } from '../Features/UserSlice'; // Using the single user slice and importing clearError

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Destructure state from the 'user' slice
  const { status, error, isLoggedIn } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [localError, setLocalError] = useState("");


  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  useEffect(() => {
    if (isLoggedIn && status === 'succeeded') {
      navigate("/");
    }
  }, [isLoggedIn, status, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    dispatch(clearError()); 

    if (!formData.fullname.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords do not match");
      setLocalError("Passwords do not match");
      return;
    }


    dispatch({
        type: 'user/setUserData',
        payload: {
           fullname: formData.fullname, 
           email: formData.email,
        }
    })
    
    // Dispatch the thunk defined in userSlice.js
    dispatch(registerUser({
      fullname: formData.fullname, 
      email: formData.email,
      password: formData.password
    }));
    
    
    // Clear password fields after submission attempt
    setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: "",
    }));
  };

  const isPending = status === 'loading';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        {/* Display local error (for password mismatch or empty fields) or Redux error */}
        {(localError || (error && status === 'failed')) && (
          <p className="text-red-600 text-center mb-3 font-medium">
            {localError || error}
          </p>
        )}

        {isPending && (
          <p className="text-blue-600 text-center mb-3 font-medium">Processing registration...</p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="fullname"
              required
              value={formData.fullname}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your name"
              disabled={isPending}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="you@example.com"
              disabled={isPending}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter password"
              disabled={isPending}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Confirm password"
              disabled={isPending}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? 'Processing...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}