const router = require('express').Router();
const itemController = require('../controllers/itemController')
const reviewController = require('../controllers/reviewController')
const maxSize = 2 * 1024 * 1024;
const multer  = require('multer')
const upload = multer({ dest: '../public/data/uploads/',
limits: { fileSize: maxSize },
fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  } 
});

router.post('/item-create', upload.single('uploaded_file'), itemController.itemCreate)
router.post('/item-list', itemController.itemList)
router.post('/item-update', itemController.itemUpdate)
router.post('/item-delete', itemController.itemDelete)
router.get('/get-history', itemController.getHistory)
router.post('/review', reviewController.giveReview)

module.exports = router