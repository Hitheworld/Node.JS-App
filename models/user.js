var mongoose = require("mongoose");  //引入建模工具模块
var UserSchema = require("../schemas/user");
var User = mongoose.model("User",UserSchema);  //编译生成模型

//将Movie构造函数导出
module.exports = User;
