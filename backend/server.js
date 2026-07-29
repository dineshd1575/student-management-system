const express = require('express');
const cors = require('cors');

const studentRoutes = require('./routes/students');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);


app.get('/', (req,res)=>{
    res.json({
        message:"Student Management Backend API Running"
    });
});


app.listen(PORT, "0.0.0.0", ()=>{
    console.log(`Server running on port ${PORT}`);
});
