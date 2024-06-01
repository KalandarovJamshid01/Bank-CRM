const {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  addOne,
  deleteAll,
} = require('./handlerController');
const db = require('./../model/index');

const users = db.users;
const getAllUsers = getAll(users);
const addOneUser = addOne(users);
const getOneUser = getOne(users);
const updateOneUser = updateOne(users);
const deleteOneUser = deleteOne(users);
const deleteAllUsers = deleteAll(users);

module.exports = {
  getAllUsers,
  addOneUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
  deleteAllUsers,
};
