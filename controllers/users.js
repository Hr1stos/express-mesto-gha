const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const JWT_SECRET = 'most-secret-key';

const getUsers = (req, res, next) => {
  userModel.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  userModel.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      next(err);
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        email: user.email,
        about: user.about,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ' Переданы некорректные данные пользователя' });
        return;
      } if (err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' });
      }
    });
};

const updateUserById = (req, res, next) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      next(err);
    });
};

const updateAvatarById = (req, res, next) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ' Переданы некорректные данные пользователя' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Email и password не могут быть пустыми' });
    return;
  }
  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        res.status(403).send({ message: 'Неверный логин или пароль' });
        return;
      }

      bcrypt.compare(password, user.password)
        .then((isValid) => {
          console.log(isValid);
          if (!isValid) {
            res.status(401).send({ message: 'Неверный логин или пароль' });
            return;
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          res.cookie('jwt', token, { httpOnly: true }).status(200).send({ message: 'Авторизация прошла успешно' });
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarById,
  login,
};
