const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { NotFoundError } = require("../middleware/errors/bad-request");
const { Conflict } = require("../middleware/errors/conflict");
const { BadRequestError } = require("../middleware/errors/bad-request");

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
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
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new NotFoundError("That card doesn't exist"))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      next(error);
    });
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new Conflict("User with that email doesn't exist"));
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
    .orFail(() => new NotFoundError("That card doesn't exist"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalida data"));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => new NotFoundError("That card doesn't exist"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalida data"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret-key",
        { expiresIn: "7d" }
      );
      res.send({ token });
    })
    .catch((err) => {
      next(new Unauthorised(err.message));
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
