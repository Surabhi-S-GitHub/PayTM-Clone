require('dotenv').config();
const mongoose = require('mongoose');

// Log the connection string being used (for debug)
console.log("Connecting to MongoDB at:", process.env.DB_STRING);

// Connect with proper options
mongoose.connect(process.env.DB_STRING, {
  family: 4 // ✅ Force IPv4 to avoid ECONNREFUSED on ::1
}).then(() => {
  console.log("✅ MongoDB connected successfully");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// User Schema
const User = mongoose.model("User", {
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
});

// Account Schema
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
});

const Account = mongoose.model('Account', accountSchema);

// Export models
module.exports = {
  User,
  Account
};
