const router = require('express').Router();
const transactionController = require('../controllers/transactionController')

router.post('/item-buy', transactionController.itemBuy)
router.post('/item-EMI', transactionController.itemEmi)
router.post('/payment', transactionController.payment)

module.exports = router