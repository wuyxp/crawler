/**
 * Created by wuyang on 2016/12/1.
 */
var express = require('express');
var router = express.Router();
var db = require('../db/qingyun');

/* GET 青云接口. */
router.get('/',(req, res, next) => {
  res.send('青云api');
});
router.get('/instance/api/', (req, res, next) => {
  var mongooseModel = db.mongodb.model('qingyun_instance',db.qingyunScheMaInstance); //  与users集合关联
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
});


module.exports = router;

