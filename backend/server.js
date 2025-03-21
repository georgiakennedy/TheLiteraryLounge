const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'https://theeliterarylounge.netlify.app'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.use('/uploads', express.static('uploads'));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
