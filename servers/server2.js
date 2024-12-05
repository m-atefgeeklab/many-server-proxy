const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/postModel');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB connection
const DB_URI = process.env.SERVER2_DB_URI || 'mongodb://127.0.0.1:27017/db2';
mongoose
  .connect(DB_URI)
  .then(() => console.log(`Connected to MongoDB at ${DB_URI}`))
  .catch((err) => console.error('MongoDB connection error:', err));

// API route to save data
app.post('/api/data/post', async (req, res) => {
  try {
    const newData = new Post(req.body);
    await newData.save();
    console.log('Server 2 saved data:', newData);
    res.json({ message: 'Data saved', data: newData });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Start the server
const PORT = process.env.SERVER2_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server 2 running on port ${PORT}`);
});
