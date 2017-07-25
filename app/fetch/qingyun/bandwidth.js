/**
 * Created by wuyang on 2016/12/2.
 */

var events = require('events');
var emitter = new events.EventEmitter();
//数据库连接类
var mongodb = require('mongoose').createConnection('mongodb://127.0.0.1:27017/crawler');//；连接数据库

var db = require('../../db/qingyun');
var mongooseModel = mongodb.model('qingyun_bandwidth', db.qingyunBandWidth); //  与users集合关联

var {By,driver,service} = require('../webdriver');

var getPrice = function(callback){
  driver.findElement(By.xpath('//div[@class="pricing-item pricing-eip"]//div[@class="price"]')).then((elm) => {
    return elm.getText();
  }).then(function(price){
    callback(price);
  });
};

var bandwidth = {
  size: [1,2,3,4,5,6,10,50,100,200,500,1000],
};

driver.get('https://www.qingcloud.com/pricing/plan').then(() => {
  return driver.getTitle();
}).then((result) => {
  getPrice((price) => {
    console.log(price);
  });
  console.log(result);
  return driver.findElement(By.xpath('//input[@name="bandwidth"]'));
}).then((elm) => {
  var date = new Date();

  var allBandwidthLength = bandwidth.size.length;
  var bandwidthNum = 0;

  var bandwidthConfig = {
    size:'',
    price:'',
    date: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
  };

  //注册监听器,带宽爬完之后的函数
  emitter.on('bandwidthAllPrice',() => {
    mongodb.close();
    driver.quit();
    service.stop();
  });
  //带宽大小选择事件
  bandwidth.size.forEach((size) => {
    elm.clear();
    elm.sendKeys(size);
    driver.sleep(100);
    elm.getAttribute('value').then((val) => {
      bandwidthConfig.size = parseInt(val);
    });
    //需要离开一下焦点,使其价格发生变化
    driver.findElement(By.id('eip')).then((elm) => {
      elm.click();
      driver.sleep(1000);
      getPrice((price) => {
        bandwidthConfig.price = price;
        console.log(bandwidthConfig);
        var mongooseEntity = new mongooseModel(bandwidthConfig);
        mongooseEntity.save((err) => {
          if(err){
            console.log(err);
          }else{
            console.log('插入第'+bandwidthNum+'条成功,共有'+allBandwidthLength+'条');
            bandwidthNum++;
            if(bandwidthNum >= allBandwidthLength){
              emitter.emit('bandwidthAllPrice');
            }
          }
        });
      })
    })
  })
});
