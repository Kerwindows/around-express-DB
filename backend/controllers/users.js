const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  HTTP_CLIENT_ERROR_NOT_FOUND,
  HTTP_CLIENT_BAD_REQUEST,
  SERVERSIDE_ERROR,
  HTTP_CLIENT_CONFLICT,
  HTTP_CLIENT_UNAUTHORISED,
} = require("../utils/utils");

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  if (!req.user) {
    return res
      .status(HTTP_CLIENT_UNAUTHORISED)
      .send({ message: "User not authorized" });
  }
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No User with that ID found");
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

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
      if (error.name === "CastError") {
        res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: "Invalid user id" });
      } else if (error.name === "DocumentNotFoundError") {
        res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: `no user found with id ${req.params.id}` });
      } else {
        res.status(SERVERSIDE_ERROR).send({ message: "internal server error" });
      }
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(HTTP_CLIENT_CONFLICT)
          .send({ message: "Email already exists" });
      }
      if (!email || !password) {
        return res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: "Missing email or password" });
      }
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return next(err);
        }
        User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        })
          .then((user) =>
            res.send({
              data: {
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
                _id: user._id,
              },
            })
          )
          .catch((err) => {
            if (err.name === "ValidationError") {
              // return res
              //   .status(HTTP_CLIENT_BAD_REQUEST)
              //   .send({ message: 'Invalid user data' });
              next(
                new BadRequestError(
                  `${Object.values(err.errors)
                    .map((error) => error.message)
                    .join(", ")}`
                )
              );
            } else {
              next(err);
            }
            return next(err);
          });
      });
    })
    .catch(next);
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: "Invalid user data" });
      } else if (error.name === "CastError") {
        return res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: "Invalid user id" });
      } else if (error.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: `No user found with id ${req.params.id}` });
      } else {
        return next(error);
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: "invalid user data" });
      } else if (error.name === "CastError") {
        res
          .status(HTTP_CLIENT_BAD_REQUEST)
          .send({ message: "invalid user id" });
      } else if (error.name === "DocumentNotFoundError") {
        res
          .status(HTTP_CLIENT_ERROR_NOT_FOUND)
          .send({ message: `no user found with id ${req.params.id}` });
      } else {
        res.status(SERVERSIDE_ERROR).send({ Message: "Internal Error" });
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        res
          .status(HTTP_CLIENT_UNAUTHORISED)
          .send({ message: "Probably a wrong email or password" });
      } else {
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret-key",
          { expiresIn: "7d" }
        );
        res.send({ token });
      }
    })
    .catch(() => {
      next(
        res
          .status(HTTP_CLIENT_UNAUTHORISED)
          .send({ message: "You shall not psss" })
      );
    });
};

module.exports = {
  getCurrentUser,
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
