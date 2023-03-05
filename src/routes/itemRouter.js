const router = require('express').Router();
const itemController = require('../controllers/itemController')
const reviewController = require('../controllers/reviewController')

router.post('/item-create', itemController.itemCreate)
router.post('/item-list', itemController.itemList)
router.post('/item-update', itemController.itemUpdate)
router.post('/item-delete', itemController.itemDelete)
router.get('/get-history', itemController.getHistory)
router.post('/review', reviewController.giveReview)

module.exports = router