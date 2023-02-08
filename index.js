require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripePayment = require("./routes/stripePayment");
const payPalPayment = require("./routes/payPalPayment");

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', stripePayment);
app.use('/api', payPalPayment);
app.use(express.static(path.join(__dirname, './client/build')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client/build/index.html')));

// DB Connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected");
}).catch((error) => {
    console.log("Something went wrong with DB connection");
});

// PORT and start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is up and running on ${port}...`)
})