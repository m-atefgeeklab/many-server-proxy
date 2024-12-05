const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB connection
const DB_URI = process.env.SERVER1_DB_URI || 'mongodb://127.0.0.1:27017/db1';
mongoose
  .connect(DB_URI)
  .then(() => console.log(`Connected to MongoDB at ${DB_URI}`))
  .catch((err) => console.error('MongoDB connection error:', err));

// API route to save data
app.post('/api/data/user', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    console.log('Server 1 saved data:', newUser);
    res.json({ message: 'Data saved', data: newUser });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Start the server
const PORT = process.env.SERVER1_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server 1 running on port ${PORT}`);
});
