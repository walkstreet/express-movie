var mongoose = require('mongoose');
var AdminSchema = require('../schemas/admin');
// 模型-Movie，基础模型结构-MovieSchema
var Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;