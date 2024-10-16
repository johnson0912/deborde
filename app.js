const express = require('express');
const bodyParser = require('body-parser');

// Routes Here
const authRoutes = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const deptRoutes = require('./routes/deptRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoute');

const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

app.get('/', function(req, res) {
    res.send('Johnson Deborde, MIT');
});

// Endpoint Here
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/department',deptRoutes);
app.use('/api/course',courseRoutes);
app.use('/api/student',studentRoutes);
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});