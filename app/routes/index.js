var express = require('express');
var router = express.Router();

var qingyun = require('./qingyun');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/qingyun/',(req,res,next) => {
  res.render('qingyun/index',{ title: '哈喽 - 青云' })
});
router.get('/qingyun/index', function(req, res, next) {
  res.render('qingyun/index',{ title: '哈喽 - 青云' });
});
router.get('/qingyun/instance/:date', function(req, res, next) {
  res.render('qingyun/instance', { title: '青云-主机价格表' ,date: req.params.date});
});
router.get('/qingyun/volume/:date', function(req, res, next) {
  res.render('qingyun/volume', { title: '青云-硬盘价格表' ,date: req.params.date});
});
router.get('/qingyun/bandwidth/:date', function(req, res, next) {
  res.render('qingyun/bandwidth', { title: '青云-带宽价格表' ,date: req.params.date});
});


module.exports = router;
