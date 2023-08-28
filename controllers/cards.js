const cardModel = require('../models/card');

const getCards = (req, res, next) => {
  cardModel.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ' Переданы некорректные данные карточки' });
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        res.status(403).send({ message: 'Вы не можете удалять карточки другого пользователя' });
      }
      cardModel.findByIdAndRemove(req.params.cardId)
        .orFail(new Error('NotValidId'))
        .then(() => {
          res.status(200).send(card);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(400).send({ message: 'Ошибка в id карты' });
            return;
          } if (err.message === 'NotValidId') {
            res.status(404).send({ message: 'Карточки нет в базе' });
            return;
          }
          next(err);
        });
    });
};

const putLike = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка в id карты' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточки нет в базе' });
        return;
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка в id карты' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточки нет в базе' });
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
