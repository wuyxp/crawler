var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/qingyun/instance', function(req, res, next) {
  res.render('index', { title: '青云-instance价格表' });
});



module.exports = router;
