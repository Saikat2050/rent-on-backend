const router = require('express').Router();
const itemController = require('../controllers/itemController')

router.post('/item-create', itemController.itemCreate)
router.post('/item-list', itemController.itemList)
router.post('/item-update', itemController.itemUpdate)
router.post('/item-delete', itemController.itemDelete)

module.exports = router