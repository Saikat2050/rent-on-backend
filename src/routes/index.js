const router = require('express').Router();
const userRouter = require('./userRouter')
const authorize = require('../middlewares/authorize')
const profileRouter = require('./profileRouter')
const itemRouter = require('./itemRouter')

router.use('/user', userRouter)
router.use(authorize)
router.use('/profile', profileRouter)
router.use('/item', itemRouter)

module.exports = router