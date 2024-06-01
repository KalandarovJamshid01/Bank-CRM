const router = require('express').Router();
const { signIn, signInRefresh } = require('./../controller/auth');
router.route('/signin').post(signIn);
router.route('/signin/new_token').post(signInRefresh);
module.exports = router;
