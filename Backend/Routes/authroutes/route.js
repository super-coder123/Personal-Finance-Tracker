const express = require("express");
const passport = require("passport");
const User = require('../../Models/user');
const upload = require("./Multer");  

const router = express.Router(); 

const isAuthenticated = (req, res, next) => {

    if (req.isAuthenticated()) {
        return next(); 
    }
    console.log("Authentication failed for profile update. Sending 401.");
    return res.status(401).json({ success: false, message: "Unauthorized." });
};

// router.get('/me', (req, res) => {
//   if (req.isAuthenticated && req.isAuthenticated()) {
//     const { _id, fullname, email, image,phone ,address } = req.user;
//     return res.status(200).json({ success: true, user: { _id, fullname, email,image,phone,address } });
//   }
//   return res.status(200).json({ success: true, user: null });
// });


router.get('/me', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, user: null });
  }

  try {
    // Fetch fresh document from DB
   const user = await User.findById(req.user._id).lean();

    if (!user) {
      return res.status(404).json({ success: false, user: null });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        image: user.image,
        transactions: user.transactions, 
        budgets: user.budgets
      }
    });

  } catch (err) {
    console.error("Error fetching current user:", err);
    return res.status(500).json({ success: false, user: null });
  }
});





// Registration Route
router.post('/register', async function(req, res) {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    
    try {
        const newUser = new User({ fullname, email });
        
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Login after registration failed:", err);
                return res.status(201).json({ 
                    success: true, 
                    message: "Registration successful, but auto-login failed.", 
                    user: { fullname: registeredUser.fullname, email: registeredUser.email } 
                });
            }
            
            // Success: Registration and auto-login completed
            return res.status(200).json({ 
                success: true, 
                message: "Registration and login successful", 
                user: { fullname: registeredUser.fullname, email: registeredUser.email } 
            });
        });

    } catch (err) {
        console.error("Registration Error:", err);
        return res.status(409).json({ 
            success: false, 
            message: err.message.includes('duplicate key') ? 'User with this email/username already exists.' : 'Registration failed due to server error.', 
            error: err.message 
        });
    }
});


router.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server error during authentication.' });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: info.message || 'Invalid username or password.' });
        }
        
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Login failed.' });
            }
            return res.status(200).json({ 
                success: true, 
                message: "Login successful", 
                user: { 
                    fullname: user.fullname, 
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    transactions: user.transactions,
                    budgets: user.budgets,
                    image: user.image
                } 
            });
        });
    })(req, res, next);
});

//addtransaction Route 
router.post('/addtransaction', async function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  try {
    const { type, date, category, amount, note } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
       {$push: {transactions: {type,date,category,amount,note}}},
       { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction added successfully.",
      user: updatedUser   
    });

  } catch (err) {
    console.error("Add transaction error:", err);
    return res.status(500).json({ success: false, message: "Failed to add transaction." });
  }
});


//addbudget Route 
router.post('/addbudget', async function (req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  try {
    const { category,limit,spent} = req.body;
    console.log(category);
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
       {$push: {budgets: {category,limit,spent}}},
       { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Budget added successfully.",
      user: updatedUser   
    });

  } catch (err) {
    console.error("Add Budget error:", err);
    return res.status(500).json({ success: false, message: "Failed to add Budget." });
  }
});





// router.put('/profile', upload.single("image"), async function(req,res){
//      if (!req.isAuthenticated()) {
//         return res.status(401).json({ success: false, message: "Unauthorized." });
//     }

//     try {
//         const { fullname, phone, address } = req.body;
//         const userId = req.user._id;

//         // NEW image if uploaded
//         let imagePath = req.user.image; 

//         if (req.file) {
//             imagePath = `/Images/${req.file.filename}`;
//         }

//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { fullname, phone, address, image: imagePath },
//             { new: true }
//         );

//         return res.status(200).json({
//             success: true,
//             message: "Profile updated successfully.",
//             user: {
//                 fullname: updatedUser.fullname,
//                 email: updatedUser.email,
//                 phone: updatedUser.phone,
//                 address: updatedUser.address,
//                 image: updatedUser.image,   // IMPORTANT
//             },
//         });
//     } catch (err) {
//         console.log("Profile update error:", err);
//         return res.status(500).json({ success: false, message: "Failed to update profile." });
//     }
// });

router.post('/profile',isAuthenticated, upload.single("image"), async function (req, res) {
     console.log("Profile route hit");

    console.log("Uploaded file:", req.file);
    console.log("Request body:", req.body);

    try {
        const { fullname, email, phone, address } = req.body;
        const userId = req.user._id;

        // Handle uploaded image
        const imagePath = req.file ? `/images/${req.file.filename}` : req.user.image; // keep existing if not uploaded

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fullname,
                email,
                phone,
                address,
                image: imagePath
            },
            { new: true, runValidators: true } // return updated doc and validate
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Explicitly return only necessary fields
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: {
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                image: updatedUser.image
            }
        });

    } catch (err) {
        console.error("Profile update error:", err);
        return res.status(500).json({ success: false, message: "Failed to update profile." });
    }
});



// Logout Route
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie('connect.sid', { path: '/' });
      return res.status(200).json({
        success: true,
        message: "Logged out successfully"
      });
    });
  });
});





// Final check before export. If this prints 'object', something is wrong.
console.log("ROUTE DIAGNOSTIC (Final): Type of router before export:", typeof router);

module.exports = router;