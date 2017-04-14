var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
// 模型-Movie，基础模型结构-MovieSchema
var Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;