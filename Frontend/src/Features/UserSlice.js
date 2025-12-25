import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import axios from 'axios'; 

const API_URL = 'http://localhost:3000'; 


 const initialState = {
  isLoggedIn: false,
  fullname: null,  
  email: null,
  phone:null,
  address:null,
  image:null,
  transactions: [],
  budgets:[],
  status: 'idle',
  error: null,
 };

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/logout`, {
        withCredentials: true, // important if using cookies/session
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
      // response.data.user = null or {fullname, email}
      return response.data.user;
    } catch (err) {
      return rejectWithValue('Failed to fetch current user.');
    }
  }
);


export const addtransaction = createAsyncThunk(
  'user/addtransaction',
   async (transactiondata, {rejectWithValue}) => {
     try{
         const response= await axios.post(`${API_URL}/addtransaction` , {
            type: transactiondata.type,
            date: transactiondata.date,
            category: transactiondata.category,
            amount: transactiondata.amount,
            note: transactiondata.note
         },{withCredentials:true});
         console.log(response);
         return response.data.user;
     }
     catch(error){
        const message = error.response?.data?.message || error.message || "transaction not added."
        console.log(message);
        return rejectWithValue(message);
      }
  }
)

export const addbudget = createAsyncThunk(
  'user/addbudget',
  async (budgetdata,{rejectWithValue}) => {
    console.log(budgetdata);
    try{
      const response = await axios.post(`${API_URL}/addbudget`,{
        category: budgetdata.category,
        limit: budgetdata.limit,
        spent: budgetdata.spent
      },{withCredentials:true});
      console.log(response);
      return response.data.user;
    }
    catch(error){
        const message = error.response?.data?.message || error.message || " budget not added."
        console.log(message);
        return rejectWithValue(message);
      }
  }
)


export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        fullname: userData.fullname, 
        email: userData.email,
        password: userData.password,
      },{withCredentials:true});
      console.log(response)
      return response.data.user; 
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed.';
      console.log(message)
      return rejectWithValue(message);
    }
  }
);


export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials,{withCredentials:true});
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed.';
      return rejectWithValue(message);
    }
  }
);


export const updateUserProfile = createAsyncThunk(
  'user/updateProfile', 
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/profile`,
        profileData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      return response.data.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile.";
      return rejectWithValue(message);
    }
  }
);




export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    addLocalbudget: (state, action) => {
        state.budgets.push(action.payload);
    },

    addLocalTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    
    setUserData: (state, action) => {
        state.isLoggedIn = true;
        state.fullname = action.payload.fullname;
        state.email = action.payload.email;
        state.phone=action.payload.phone;
        state.address=action.payload.address;
        state.image=action.payload.image || state.image;
        state.status = 'succeeded';
    },
    logout: (state) => {
      Object.assign(state,initialState);
    },
   
    clearError: (state) => {
        state.error = null;
        state.status = 'idle';
    }
  },

  extraReducers: (builder) => {
   
    builder
      .addCase(logoutUser.fulfilled, (state) => {
          state.isLoggedIn = false;
          state.fullname = null;
          state.email = null;
          state.phone = null;
          state.address = null;
          state.transactions = [];
          state.budgets = [];
        })

      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // action.payload.user is the object { fullname, email, phone, address, image }
        const updatedUser = action.payload.user || {};
        Object.assign(state, updatedUser); // Safely merge all properties from the response
      })

      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to connect to server.';
      })
      .addCase(loginUser.fulfilled , (state,action) => {
          state.status = 'succeeded';
          state.isLoggedIn = true;
          state.fullname = action.payload.fullname;
          state.email = action.payload.email;
          state.phone = action.payload.phone;
          state.image = action.payload.image;
          state.address = action.payload.address;
          state.transactions = action.payload.transactions;
          state.budgets= action.payload.budgets;
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("FETCH USER PAYLOAD 👉", action.payload);

        if (action.payload) {
          state.isLoggedIn = true;
          state.fullname = action.payload.fullname;
          state.email = action.payload.email;
          state.phone = action.payload.phone;
          state.address = action.payload.address;
          state.image = action.payload.image;
          state.transactions = action.payload.transactions || [];
          state.budgets = action.payload.budgets || [];
        } else {
          state.isLoggedIn = false;
        }
      })

      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "succeeded"; // IMPORTANT ❗
        state.isLoggedIn = false;
      })


      .addMatcher(
        (action) => [registerUser.pending.type, loginUser.pending.type].includes(action.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
 
      .addMatcher(
        (action) => [registerUser.fulfilled.type, loginUser.fulfilled.type].includes(action.type),
        (state, action) => {
          state.status = 'succeeded';
          state.isLoggedIn = true;
          state.fullname = action.payload.fullname; 
          state.email = action.payload.email; 
          state.username = action.payload.fullname; 
          state.error = null;
        }
      )

      .addMatcher(
        (action) => [registerUser.rejected.type, loginUser.rejected.type].includes(action.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload || 'Authentication failed.';
          state.isLoggedIn = false;
        }
      );      
  },
});


export const { setUserData, logout, clearError } = userSlice.actions;
export default userSlice.reducer;