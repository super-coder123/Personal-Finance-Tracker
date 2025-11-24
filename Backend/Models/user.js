const mongoose =require("mongoose");
const {Schema}= mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userschema = new Schema({
    email:{
        type:String,
         required:true,
    },
    fullname:{
        type:String,
       // required:true
    },
    profilepic:{
        type:String,
    },
    dob:{
        type:Date,
        // required:true
    },
    phone:{
        type:Number,
        // required:true,
        minlength:10,
        maxlength:10
    },
    address:{
        type:String,
        // required:true
    },
    image:{
        type:String
    },
    transactions: [{
        type: { type: String, enum: ["income", "expense"] },
        category: { type: String },
        amount: { type: Number},
        date: { type: Date, default: Date.now },
        note: { type: String }
    }],
    budgets: [{
        category: { type: String },
        spent: {type: Number},
        limit: {type: Number}
    }],
    reminders: [{ type: String }]
});

userschema.plugin(passportLocalMongoose,{usernameField:"email"});
module.exports=mongoose.model("User",userschema);