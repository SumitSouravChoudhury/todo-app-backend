/* eslint-disable no-console */
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const taskRoute = require('./routes/task');
const { authenticate } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: '*',
    exposedHeaders: ['Authorization'],
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', authenticate, userRoute);
app.use('/api/task', authenticate, taskRoute);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
