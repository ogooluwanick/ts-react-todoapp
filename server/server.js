const express = require('express');
const path = require('path'); // Import path module
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Import Routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

// Basic Route
app.get('/', (req, res) => {
    res.send('Todo App Backend Server is Running!');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
