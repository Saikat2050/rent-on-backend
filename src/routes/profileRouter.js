const router = require('express').Router();
const profileController = require('../controllers/profileController')

router.get('/get-profile', profileController.getProfile)
router.post('/update-profile', profileController.updateProfile)
router.post('/delete-profile', profileController.deleteProfile)

module.exports = router