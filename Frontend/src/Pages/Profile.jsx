import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile , logoutUser, logout, fetchCurrentUser} from "../Features/UserSlice";
import { persistor } from "../Features/Store/Store";


const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Define the server address (Must match your Express PORT)
  const API_BASE_URL = "http://localhost:3000"; 
  
  // Redux user data
  const { fullname, email, phone, address,image} = useSelector((state) => state.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // 🔑 NEW STATE: Used to force the image component to re-render
  const [imageKey, setImageKey] = useState(0); 

  // Construct the full URL for display (Includes a cache-buster)
  const profileImageUrl = image 
    ? `${API_BASE_URL}${image}?t=${Date.now()}` 
    : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
  
  // Local State 
  const [formData, setFormData] = useState({
    fullname: fullname || "",
    email: email || "",
    phone: phone || "",
    address: address ||"",
    image: image || ""
  });

  const [imagetadd, setImagetadd] = useState(null);
  const [imagetaddFile, setImagetaddFile] = useState(null);

  useEffect(() => {
    // Sync local form data with Redux state
    setFormData({
      fullname: fullname || "",
      email: email || "",
      phone: phone || "",
      address: address || "",
      image: image || ""
    });
  }, [fullname, email, phone, address, image]); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) 
    {
       setImagetadd(URL.createObjectURL(file));
       setImagetaddFile(file); 
    }   
  };

  // 🔑 FINAL SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("fullname", formData.fullname);
    form.append("phone", formData.phone);
    form.append("email", formData.email);
    form.append("address", formData.address);
    if (imagetaddFile) form.append("image", imagetaddFile);
    
    try{
        await dispatch(updateUserProfile(form)).unwrap(); 
        setImagetadd(null); 
        setImagetaddFile(null);
        setImageKey(prevKey => prevKey + 1); 
        dispatch(fetchCurrentUser());   
   } catch(error) {
      console.log("Profile update failed:", error);
    }
  };


  const handlelogout = async () => {
   try{
    dispatch(logout());
    await dispatch(logoutUser());     
    await persistor.flush();   
    await persistor.purge();               
    navigate("/login", { replace: true }); 
   }
  catch(err){
    console.log(err);
  }
};

const handlelogin = async () => {
  navigate("/login");
}


  return (
    <div className="w-full h-full bg-gray-50 p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
        {isLoggedIn && <button onClick={handlelogout} className="bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer">Logout</button>}
        {!isLoggedIn && <button onClick={handlelogin} className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer">Login</button>}
      </div>

      <div className="flex gap-10">
        {/* LEFT: Image */}
        <div className="w-1/3 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>

          <div className="flex flex-col items-center">
           
           <img
                src={
                  imagetadd  
                  || profileImageUrl  
                 }
                alt="Profile"
                key={imageKey}
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />


            <label className="mt-4">
              <input type="file" onChange={handleImage} className="hidden" />
              <span className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                Upload New
              </span>
            </label>
          </div>
        </div>

        {/* RIGHT: Form */}
        <form onSubmit={handleSubmit} className="w-2/3 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring focus:ring-blue-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                disabled
                value={formData.email}
                className="w-full border p-3 rounded-xl bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring focus:ring-blue-400"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring focus:ring-blue-400"
              />
            </div>d
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;