const express = require("express");
const { celebrate, Joi } = require("celebrate");

const router = express.Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/", getCards);

// router.post("/", createCard);
router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .pattern(
          new RegExp(
            "^((https?|ftp|smtp)://)?(www.)?[a-z0-9]+.[a-z]+(/[a-zA-Z0-9#]+/?)*$"
          )
        )
        .required(),
    }),
  }),
  createCard
);

// router.delete("/:cardId", deleteCard);
router.delete(
  "/:cardId",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().hex().length(24),
    }),
  }),
  deleteCard
);

// router.put("/:cardId/likes", likeCard);
router.put(
  "/:cardId/likes",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().hex().length(24),
    }),
  }),
  likeCard
);

// router.delete("/:cardId/likes", dislikeCard);
router.delete(
  "/:cardId/likes",
  celebrate({
    body: Joi.object().keys({
      _id: Joi.string().hex().length(24),
    }),
  }),
  dislikeCard
);

module.exports = router;
