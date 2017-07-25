/**
 * Created by wuyang on 2016/12/2.
 */

var events = require('events');
var emitter = new events.EventEmitter();
//数据库连接类
var mongodb = require('mongoose').createConnection('mongodb://127.0.0.1:27017/crawler');//；连接数据库

var db = require('../../db/qingyun');
var mongooseModel = mongodb.model('qingyun_volume', db.qingyunVolume); //  与users集合关联

var {By,driver,service} = require('../webdriver');

var getPrice = function(callback){
  driver.findElement(By.xpath('//div[@class="pricing-item pricing-volume"]//div[@class="price"]')).then((elm) => {
    return elm.getText();
  }).then(function(price){
    callback(price);
  });
};

var volume = {
  type : [],
  size: [10,100,1000,1000*2,1000*5],
};

driver.get('https://www.qingcloud.com/pricing/plan').then(() => {
  return driver.getTitle();
}).then((result) => {
  getPrice((price) => {
    console.log(price);
  });
  console.log(result);
  return driver.findElements(By.xpath('//div[@class="pricing-item pricing-volume"]//ul[@class="volumes"]/li'));
}).then((elms) => {
  elms.forEach((elm) => {
    elm.getText().then((label) => {
      //硬盘类型
      console.log(label);
      volume.type.push(label);
    });
  });
  return driver.findElements(By.xpath('//div[@class="pricing-item pricing-volume"]//ul[@class="volumes"]/li'));

}).then((elms) => {
  var date = new Date();

  var allVolumeLength = volume.type.length * volume.size.length;
  var volumeNum = 0;

  var volumeConfig = {
    type:'',
    size:'',
    price:'',
    date: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
  };

  //注册监听器,volume爬完之后的函数
  emitter.on('volumeAllPrice',() => {
    mongodb.close();
    //driver.quit();
    //service.stop();
  });

  //硬盘类型点击事件
  elms.forEach((elm) => {
    elm.click();
    driver.sleep(200);
    elm.getText().then((text) => {
      volumeConfig.type = text;
    });
    volume.size.forEach((size) => {
      driver.findElement(By.xpath('//input[@name="volume"]')).then((elm) => {
        elm.clear();
        elm.sendKeys(size);
        driver.sleep(100);
        elm.getAttribute('value').then((val) => {
          volumeConfig.size = parseInt(val);
        });
        //需要离开一下焦点,使其价格发生变化
        driver.findElement(By.id('volume')).then((elm) => {
          elm.click();
          driver.sleep(1000);
          getPrice((price) => {
            volumeConfig.price = price;
            console.log(volumeConfig);
            var mongooseEntity = new mongooseModel(volumeConfig);
            mongooseEntity.save((err) => {
              if(err){
                console.log(err);
              }else{
                console.log('插入第'+volumeNum+'条成功,共有'+allVolumeLength+'条');
                volumeNum++;
                if(volumeNum >= allVolumeLength){
                  emitter.emit('volumeAllPrice');
                }
              }
            });
          })
        })
      })
    })
  });

});
