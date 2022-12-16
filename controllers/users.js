const User = require('../models/user');
const {
  HTTP_CLIENT_ERROR_NOT_FOUND,
  HTTP_CLIENT_BAD_REQUEST,
  SERVERSIDE_ERROR,
} = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.send(users))
    .catch((error) => res.status(HTTP_CLIENT_BAD_REQUEST).send(error));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: 'invalid user id' });
      } else if (error.name === 'DocumentNotFoundError') {
        res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: `no user found with id ${req.params.id}` });
      } else {
        res.status(SERVERSIDE_ERROR).send({ message: 'internal server error' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: 'invalid user data' });
      } else {
        res.status(SERVERSIDE_ERROR).send({ Message: 'internal error' });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: 'invalid user data' });
      } else if (error.name === 'CastError') {
        res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: 'invalid user id' });
      } else if (error.name === 'DocumentNotFoundError') {
        res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: `no user found with id ${req.params.id}` });
      } else {
        res.status(SERVERSIDE_ERROR).send({ Message: 'internal error' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(req.user._id, avatar, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: 'invalid user data' });
      } else if (error.name === 'CastError') {
        res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: 'invalid user id' });
      } else if (error.name === 'DocumentNotFoundError') {
        res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: `no user found with id ${req.params.id}` });
      } else {
        res.status(SERVERSIDE_ERROR).send({ Message: 'Internal Error' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
