const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const { notFound } = require('../controllers/notFound');

router.use('/*', notFound);
router.use(userRouter);
router.use(cardRouter);

module.exports = router;
