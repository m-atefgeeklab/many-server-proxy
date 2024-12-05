const mongoose = require("mongoose");

// Define data schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
},
  {
    timestamps: true,
  }
);

// Export the model
const User = mongoose.model("User", userSchema);

module.exports = User;
