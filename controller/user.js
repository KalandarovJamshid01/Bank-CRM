const {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  addOne,
  deleteAll,
} = require('./handlerController');
const db = require('./../model/index');
const sequelize = db.sequelize;
const { QueryTypes } = require('sequelize');
const catchErrorAsync = require('../util/catchError');
const QRCode = require('qrcode');
const excelToJson = require('convert-excel-to-json');
const parceUrl = require('parse-url');
const bcrypt = require('bcryptjs');
const responseFunction = require('./../util/response');
const users = db.users;
const rates = db.rates;

const getAllUsers = getAll(
  users,
  [{ model: rates, attributes: [] }],
  'name',
  'email'
);
const addOneUser = addOne(users);
const getOneUser = getOne(users, [
  { model: rates, attributes: ['rate', 'comment', 'createdAt'] },
]);
const updateOneUser = updateOne(users);
const deleteOneUser = deleteOne(users);
const deleteAllUsers = deleteAll(users);

const getQRCode = catchErrorAsync(async (req, res, next) => {
  // Generate QR code as a data URL
  const user = await users.findOne({ where: { id: req.params.id } });
  const url = `https://rating-bar-front.vercel.app/?userId=${user.id}`;

  const qrCodeDataUrl = await QRCode.toDataURL(url);

  // Extract base64 data from data URL
  const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');

  // Convert base64 data to buffer
  const imgBuffer = Buffer.from(base64Data, 'base64');

  // Set response content type and send image buffer
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${user.name}_qr.png`
  );
  res.setHeader('Content-Type', 'image/png');
  res.send(imgBuffer);
});

const addRate = addOne(rates);

const addUserByFile = catchErrorAsync(async (req, res, next) => {
  const path = parceUrl(req.body.url);
  const result = excelToJson({
    sourceFile: `${__dirname}/..${path.pathname}`,
  });
  if (!result) {
    return next(new AppError('Faylni saqlashda xatolik yuz berdi', 402));
  }

  const bcryptFunc = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(`${password}`, salt);
    return hash;
  };

  result[`${Object.keys(result)[0]}`].map(async (item) => {
    item.D = bcryptFunc(item?.D);
    await users.create({
      name: item?.A,
      email: item?.B,
      position: item?.C,
      password: item?.D,
    });
  });

  responseFunction(
    req,
    res,
    200,
    'Created',
    result[`${Object.keys(result)[0]}`].length
  );
});

const getUserStats = catchErrorAsync(async (req, res, next) => {
  const { id } = req.params;
  let { start, end, limit, page } = req.query;
  limit = limit || 10000;
  start = start || '2023-03-06';
  end = end || new Date().toISOString();
  page = page || 1;
  console.log(id, start, end, page, limit);
  const offset = (page - 1) * limit;
  const query = `SELECT 
    id, 
    rate, 
    comment, 
    createdAt, 
    AVG(rate) OVER (PARTITION BY userId) as averagerate
FROM 
    rates 
WHERE 
    userId = :id
    AND createdAt BETWEEN :start AND :end
LIMIT :limit 
OFFSET :offset;
`;
  const stats = await sequelize.query(query, {
    replacements: {
      id,
      start,
      end,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
    type: QueryTypes.SELECT,
  });

  //   const queryCount = `SELECT
  //     id,
  //     rate,
  //     comment,
  //     createdAt,
  // FROM
  //     rates
  // WHERE
  //     userId = :id
  //     AND createdAt BETWEEN :start AND :end`;
  //   const queryStats = await sequelize.query(queryCount, {
  //     replacements: {
  //       id,
  //       start,
  //       end,
  //     },
  //     type: QueryTypes.SELECT,
  //   });
  responseFunction(req, res, 200, stats, 100);
});

module.exports = {
  getAllUsers,
  addOneUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
  deleteAllUsers,
  getQRCode,
  addRate,
  addUserByFile,
  getUserStats,
};
