const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
// const utf8 = require("utf8");

var storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    file.originalname = Buffer.from(file.originalname, 'latin1')
      .toString('utf8')
      .replaceAll(' ', '_');
    const generateName = uuidv4() + '-' + file.originalname;
    cb(null, generateName);
  },
});

const upload = multer({
  storage,
  // limits: { fileSize: 5_242_880, fieldNameSize: 100 },
});

const uploadFile = (req, res, next) => {
  const protocol = req.protocol;
  const host = req.hostname;
  const url = req.originalUrl;
  const port = process.env.PORT;

  if (req.file) {
    return res.status(200).json({
      filename: req.file.originalname,
      url: `${process.env.SERVER_URL}/${req.file.path}`,
    });
  }

  return res.status(400).json({ msg: 'PLEASE REUPLOAD FILE' });
};

module.exports = { uploadFile, upload };
