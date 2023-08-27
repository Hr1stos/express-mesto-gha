const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  updateUserById,
  updateAvatarById,
} = require('../controllers/users');

const {
  validateGetUserById,
  validateUpdateUserById,
  validateUpdateAvatarById,
} = require('../middlewares/requestValidation');

router.get('/users', auth, getUsers);
router.get('/users/:id', auth, validateGetUserById, getUserById);
router.patch('/users/me', auth, validateUpdateUserById, updateUserById);
router.patch('/users/me/avatar', auth, validateUpdateAvatarById, updateAvatarById);

module.exports = router;
