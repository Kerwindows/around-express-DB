require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const SERVERSIDE_ERROR = require('./utils/utils');
const { requestLogger, errorLogger } = require('./middleware/logger');
const auth = require('./middleware/auth');
const NotFoundError = require('./middleware/errors/not-found');

const allowedOrigins = ['http://localhost:3001', 'https://kerwindows.students.nomoredomainssbs.ru', 'https://www.kerwindows.students.nomoredomainssbs.ru'];

const app = express();
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));

mongoose.connect('mongodb://localhost:27017/aroundb');
app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({
      scheme: ['http', 'https'],
      allowRelative: true,
    }).trim(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use(requestLogger);
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use('/users', usersRouter);
app.use('/cards', cardRouter);


app.use((req, res, next) => {
  next(new NotFoundError('Not found'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  console.error(err);
  const { status = SERVERSIDE_ERROR, message } = err;
  res.status(status).send({ message });
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  console.log('Server is running');
});
