var express = require('express');
var router = express.Router();

var qingyun = require('./qingyun');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/qingyun/instance', function(req, res, next) {
  res.render('qingyun/instance', { title: '青云-instance价格表' });
});



module.exports = router;
