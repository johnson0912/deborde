const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Routes Here
const authRoutes = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const deptRoutes = require('./routes/deptRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoute');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Johnson Deborde, MIT');
});

// Endpoint Here
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/department', deptRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/student', studentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
