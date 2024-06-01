const router = require('express').Router();
const uploadFile = require('./../controller/uploadFile');

router
  .route('/')
  .post(uploadFile.upload.single('file'), uploadFile.uploadFile)
  .get();
module.exports = router;
