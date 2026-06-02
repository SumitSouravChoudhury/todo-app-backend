const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
