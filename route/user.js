const router = require('express').Router();
const {
  getAllUsers,
  addOneUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
  deleteAllUsers,
  getQRCode,
  addRate,
  addUserByFile,
} = require('./../controller/user');
const {
  protect,
  role,
  bcryptFunc,
  checkUser,
  addParamUser,
} = require('./../controller/verify');

router
  .route('/')
  .get(protect, role('admin'), getAllUsers)
  .post(protect, role('admin'), bcryptFunc, addOneUser);

router.route('/all').delete(protect, role('admin'), deleteAllUsers);
router.route('/me').get(protect, addParamUser, getOneUser);
router.route('/rate').post(addRate);
router.route('/file').post(addUserByFile);
router.route('/qrcode/:id').get(protect, getQRCode);

router
  .route('/:id')
  .get(protect, getOneUser)
  .patch(protect, checkUser, bcryptFunc, updateOneUser)
  .delete(protect, role('admin'), deleteOneUser);
module.exports = router;
