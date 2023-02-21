const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BadRequest } = require('../middleware/errors/bad-request');
const { NotFoundError } = require('../middleware/errors/not-found');
const { Unauthorised } = require('../middleware/errors/unauthorised');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No User with that ID found');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .orFail()
    .then((users) => {
      if (!users) {
        throw new BadRequest('Unacceptable request');
      }
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(409).send({ message: 'Try another email' });
      }
    });
  if (!email || !password) {
    throw new BadRequest('Missing email or password');
  }
  // if email already exists, throw 409
  return bcrypt.hash(password, 10, (err, hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        res.send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          },
        });
      })
      .catch(next);
  });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail()
    .then((user) => {
      if (!user) {
        throw new BadRequest('Invalid user data');
      }
      res.send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => {
      if (!user) {
        throw new BadRequest('Invalid user data');
      }
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new Unauthorised('Probably a wrong email or password');
      } else {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key', { expiresIn: '7d' });
        res.send({ token });
      }
    })
    .catch(() => {
      next(new Unauthorised('That email or password shall not pass'));
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
