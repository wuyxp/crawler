var mongoose = require('mongoose');

//  定义了一个主机的模型
var qingyunScheMaInstance  = new mongoose.Schema({
  images: String,
  resourceClass: String,
  cpu: String,
  memory: String,
  make: String,
  price: String,
  change: String,
  date: String,
}); 
var qingyunVolume = new mongoose.Schema({
  type: String,
  size: String,
  make: String,
  price: String,
  change: String,
  date: String,
});
var qingyunBandWidth = new mongoose.Schema({
  size: String,
  make: String,
  price: String,
  change: String,
  date: String,
});
var qingyun = new mongoose.Schema({
  make: String,
  change: String,
  date:String,
});
module.exports = {
  qingyunScheMaInstance,
  qingyunVolume,
  qingyunBandWidth,
  qingyun
}
