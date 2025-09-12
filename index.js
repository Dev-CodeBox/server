const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoConnect = require('./config/mongo.connect');
const userRoutes = require('./routes/user.routes');

dotenv.config();

const app = express();
mongoConnect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
