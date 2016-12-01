/**
 * Created by wuyang on 2016/12/1.
 */
var express = require('express');
var router = express.Router();
var db = require('../db/qingyun');

/* GET 青云接口. */
router.get('/instance', function(req, res, next) {
  db.mongodb;
});


module.exports = router;

