const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();      // 🔥 MUST be before connectDB
connectDB();          // 🔥 MUST be before routes

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/events', require('./routes/event'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
