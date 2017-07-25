/**
 * Created by wuyang on 2016/12/1.
 */
var express = require('express');
var router = express.Router();
var db = require('../db/qingyun');
//数据库连接类
var mongodb = require('mongoose').createConnection('mongodb://127.0.0.1:27017/crawler');//；连接数据库
/* GET 青云接口. */
router.get('/api/',(req,res,next) => {
  var mongooseModel = mongodb.model('qingyun',db.qingyun);
  mongooseModel.find({},(error,result)=>{
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
});
router.get('/api/instance/', (req, res, next) => {
  var mongooseModel = mongodb.model('qingyun_instance',db.qingyunScheMaInstance);
  mongooseModel.find({date:req.query.date},(error,result)=>{
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
});
router.get('/api/volume/', (req, res, next) => {
  var mongooseModel = mongodb.model('qingyun_volume',db.qingyunVolume);
  mongooseModel.find({date:req.query.date},(error,result)=>{
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
});
router.get('/api/bandwidth/', (req, res, next) => {
  var mongooseModel = mongodb.model('qingyun_bandwidth',db.qingyunBandWidth);
  mongooseModel.find({date:req.query.date},(error,result)=>{
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
});

module.exports = router;

