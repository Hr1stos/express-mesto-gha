const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/requestValidation');

router.get('/cards', auth, getCards);
router.post('/cards', auth, validateCreateCard, createCard);
router.delete('/cards/:cardId', auth, validateCardId, deleteCard);
router.put('/cards/:cardId/likes', auth, validateCardId, putLike);
router.delete('/cards/:cardId/likes', auth, validateCardId, deleteLike);

module.exports = router;
