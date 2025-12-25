// 1. aquiring required links
const dotenv = require("dotenv");
dotenv.config({ path: '../dotenv/.env' }); 

// 2. IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport"); 
const session = require("express-session") 
const cors = require('cors'); 
// const path = require('path'); // Path import is not needed if only used for static files

const User = require("./Models/user"); 
const authRoutes = require("./Routes/authroutes/route.js"); 

// 3. INITIALIZATION
const app = express();
const MONGODB_URI = process.env.DB;
const PORT = process.env.PORT || 3000; 

// 4. Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// 5. MIDDLEWARE
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static images
app.use("/images", express.static("Public/Images"));

app.set("trust proxy", 1); // For deployment behind a proxy (safe to keep)

app.use(
  session({
    secret: process.env.SESSION_SECRET || "temp_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Must be false for http://localhost and true for https:....
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);


app.use(passport.initialize());
app.use(passport.session()); 

passport.use(User.createStrategy());      

// ✅ FIX: Explicit Mongoose-based serialization/deserialization for reliability
passport.serializeUser(function(user, done) {
    done(null, user.id); 
});

passport.deserializeUser(function(id, done) {
    User.findById(id) 
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            console.error("Deserialize Error:", err);
            done(err, null);
        });
});

app.use(authRoutes);

// 6. SERVER START
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));













