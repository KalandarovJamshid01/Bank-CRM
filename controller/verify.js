const AppError = require('../util/AppError');
const catchErrorAsync = require('../util/catchError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./../model/index');
const users = db.users;
const protect = catchErrorAsync(async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError('You are not login', 401));
  }
  jwt.verify(token, process.env.JWT_SECRET_ACCESS, async (err, user) => {
    if (err) {
      return next(new AppError('Token is invallid', 403));
    }

    const theUser = await users.findOne({
      where: {
        id: user.id,
      },
    });
    if (!theUser) {
      return next(new AppError('You are not register', 401));
    }
    req.user = theUser;
    next();
  });
});

const role = (roles) => {
  return catchErrorAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not authorized to perform this practice!', 401)
      );
    }
    next();
  });
};

const bcryptFunc = (req, res, next) => {
  if (req.body.password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;
  }
  next();
};
const checkUser = (req, res, next) => {
  if (req.user.role != 'admin') {
    if (req.user.id != req.params.id) {
      return next(new AppError('You can only change your own information'));
    }
  }
  next();
};
const addParamUser = (req, res, next) => {
  // console.log(req.user.id);
  req.params.id = req.user.id;
  next();
};

module.exports = { protect, role, bcryptFunc, checkUser, addParamUser };
