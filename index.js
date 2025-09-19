const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const expressFileUpload = require('express-fileupload');
const mongoConnect = require('./config/mongo.connect');
const cloudinaryConnect = require('./config/cloudinary.connect');
const userRoutes = require('./routes/user.routes');

dotenv.config();

const app = express();
mongoConnect();
cloudinaryConnect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressFileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


app.use('/api/users', userRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
