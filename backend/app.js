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
const auth = require("./middleware/auth");
const allowedOrigins = [
  "http://localhost:3001"
]
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(cors({ origin: allowedOrigins }));

mongoose.connect("mongodb://localhost:27017/aroundb");
app.use(express.json());

const usersRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

// app.use((req, res, next) => {
//   req.user = {
//     _id: "63f33b8ad87c5559dc556712",
//   };
//   next();
// });

app.post('/signin', login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use(requestLogger);
app.use("/users", usersRouter);
app.use("/cards", cardRouter);

// Handle 404 errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = HTTP_CLIENT_ERROR_NOT_FOUND;
  next(error);
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  console.error(err);
  const { status = SERVERSIDE_ERROR, message } = err;
  //res.status(status).send({ message });
  res.send({ message });
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log("Server is running");
});
