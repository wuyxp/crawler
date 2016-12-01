var mongoose = require('mongoose');
//数据库连接类
var mongodb = mongoose.createConnection('mongodb://127.0.0.1:27017/crawler');//；连接数据库

//  定义了一个主机的模型
var qingyunScheMaInstance  = new mongoose.Schema({
  images: String,
  resourceClass: String,
  cpu: String,
  memory: String,
  price: String,
  date: String
}); 

module.exports = {
  mongodb ,qingyunScheMaInstance
}
