const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { login, createUser } = require('./controllers/users');
const { celebrate, Joi, errors } = require("celebrate");
const {
  HTTP_CLIENT_ERROR_NOT_FOUND,
  SERVERSIDE_ERROR,
} = require("./utils/utils");
const { requestLogger, errorLogger } = require("./middleware/logger");

const app = express();
app.use(helmet());
// app.use(cors());
// app.options('*', cors());

const allowedOrigins = [
  "http://localhost:3001"
]

app.use(cors({ origin: allowedOrigins }));
require('dotenv').config();

mongoose.connect("mongodb://localhost:27017/aroundb");
app.use(express.json());

const usersRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

// app.use((req, res, next) => {
//   req.user = {
//     _id: "633aa7a3e593d7786651c531",
//   };
//   next();
// });

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', login);

app.use(requestLogger);
app.use("/users", usersRouter);
app.use("/cards", cardRouter);

app.use((req, res) => {
  res
    .status(HTTP_CLIENT_ERROR_NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

app.use(errorLogger);
app.use(errors());
  

app.use((err, req, res, next) => {
  console.error(err);
  // if an error has no status, display 500
  const { SERVERSIDE_ERROR, message } = err;
  res.status(SERVERSIDE_ERROR).send({
    // check the status and display a message based on it
    message: SERVERSIDE_ERROR ? "An error occurred on the server" : message,
  });
  
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log("Server is Running");
});

//test
