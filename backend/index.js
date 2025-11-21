const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// route files
const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow frontend to load JS from backend folder
app.use('/js', express.static(path.join(__dirname)));

// allow frontend files (html/css) to load from project root
app.use(express.static(path.join(__dirname, '..')));

// health check
app.get('/health', (req, res) => {
  res.send('Backend is running');
});

// endpoints
app.use('/api', registerRoute);
app.use('/api', loginRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
