var mongoose = require("mongoose");  //引入建模工具模块
var MovieSchema = require("../schemas/movie");
var Movie = mongoose.model("Movie",MovieSchema);  //编译生成模型

//将Movie构造函数导出
module.exports = Movie;
