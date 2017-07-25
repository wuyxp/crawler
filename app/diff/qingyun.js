/**
 * Created by wuyang on 2016/12/2.
 */
console.log('diff-instance');
var db = require('../db/qingyun');
//数据库连接类
var mongodb = require('mongoose').createConnection('mongodb://127.0.0.1:27017/crawler');//；连接数据库
var mongooseModel = mongodb.model('qingyun_instance',db.qingyunScheMaInstance); //  与users集合关联
var date = new Date();
mongooseModel.find((error,result)=>{
  if(error){
    res.send({
      code : 1,
      massage : '请求失败',
      error : error
    })
  }else{
    res.send({
      code : 0,
      list : result
    });
  }
});
