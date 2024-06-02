const {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  addOne,
  deleteAll,
} = require('./handlerController');
const db = require('./../model/index');
const catchErrorAsync = require('../util/catchError');
const QRCode = require('qrcode');
const users = db.users;
const getAllUsers = getAll(users);
const addOneUser = addOne(users);
const getOneUser = getOne(users);
const updateOneUser = updateOne(users);
const deleteOneUser = deleteOne(users);
const deleteAllUsers = deleteAll(users);

const getQRCode = catchErrorAsync(async (req, res, next) => {
  // Generate QR code as a data URL
  const url = `${process.env.SERVER_URL}/users/${req.params.id}`;

  const qrCodeDataUrl = await QRCode.toDataURL(url);

  // Extract base64 data from data URL
  const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');

  // Convert base64 data to buffer
  const imgBuffer = Buffer.from(base64Data, 'base64');

  // Set response content type and send image buffer
  res.setHeader('Content-Type', 'image/png');
  res.send(imgBuffer);
});

module.exports = {
  getAllUsers,
  addOneUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
  deleteAllUsers,
  getQRCode,
};
