const express = require('express');
const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  getCurrentUser,
  updateAvatar,
} = require('../controllers/users');

const customUrlValidator = (value, helpers) => {
  const pattern = new RegExp('^(https?:\\/\\/)?'
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'
    + '((\\d{1,3}\\.){3}\\d{1,3}))'
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'
    + '(\\?[;&amp;a-z\\d%_.~+=-]*)?'
    + '(\\#[-a-z\\d_]*)?$', 'i');

  if (pattern.test(value)) {
    return value;
  }

  return helpers.message('Invalid URL');
};

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(customUrlValidator),
    }),
  }),
  updateAvatar,
);

module.exports = router;
