const { NotFoundError } = require('../middleware/errors/not-found');
const { ForbiddenError } = require('../middleware/errors/forbidden');
const { BadRequestError } = require('../middleware/errors/bad-request');
const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cardData) => {
      res.send(cardData);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalida data'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById({ _id: req.params.cardId })
    .orFail(() => new NotFoundError("That card doesn't exist"))
    .then((card) => {
      if (req.user._id === card.owner._id.toString()) {
        Card.findByIdAndRemove({ _id: req.params.cardId })
          .orFail()
          .then((cardData) => res.send({ data: cardData }))
          .catch(next);
      } else {
        next(new ForbiddenError("You don't have permission to delete this card"));
      }
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError("That card doesn't exist"))
    .then((cardData) => res.send(cardData))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail(() => new NotFoundError("That card doesn't exist"))
    .then((cardData) => res.send(cardData))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
