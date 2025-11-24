import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from '../Features/UserSlice'; 

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  
  const { status, error, isLoggedIn } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  useEffect(() => {
    if (isLoggedIn && status === 'succeeded') {
      navigate("/");
    }
  }, [isLoggedIn, status, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    dispatch(loginUser({
      email: formData.email,
      password: formData.password,
    }));
  };

  const isPending = status === 'loading';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {error && status === 'failed' && (
          <p className="text-red-600 text-center mb-3 font-medium">{error}</p>
        )}

        {error && console.log(error)}

        {/* Display loading state */}
        {isPending && (
          <p className="text-blue-600 text-center mb-3 font-medium">Logging in...</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

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

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}