/**
 * Created by wuyang on 2016/12/2.
 */

var events = require('events');
var emitter = new events.EventEmitter();

var db = require('../../db/qingyun');

//数据库连接类
var mongodb = require('mongoose').createConnection('mongodb://127.0.0.1:27017/crawler');//；连接数据库
var mongooseModel = mongodb.model('qingyun_instance', db.qingyunScheMaInstance); //  与users集合关联

var qingyunModel = mongodb.model('qingyun', db.qingyun); //  与users集合关联

var {By,driver,service} = require('../webdriver');

var getPrice = function(callback){
  driver.findElement(By.className('price')).then(function(elm){
    return elm.getText();
  }).then(function(price){
    callback(price);
  });
};

var Instance = {
  images : [],
  resourceClass: [],
  cpu: [],
  memory: []
};

var resourceClassJSON = {
  '性能型' : 'xn',
  '超高性能型': 'sn'
};

driver.get('https://www.qingcloud.com/pricing/plan').then(() => {
  return driver.getTitle();
}).then((result) => {
  getPrice((price) => {
    console.log(price);
  });
  console.log(result);
  return driver.findElement(By.className('pricing-item'));
}).then((result) => {
  driver.findElement(By.className('panel')).then(() => {

    //主机镜像
    driver.findElement(By.className('images')).then((elm) => {
      return elm.getText();
    }).then((label) => {
      Instance.images = label.split(/\s+/);
    });

    //主机性能
    driver.findElements(By.xpath('//div[@class="cpu-memory"]/ul[@class="resource-class"]/li')).then((elms) => {
      elms.forEach((elm) => {
        elm.getText().then((label) => {
          Instance.resourceClass.push(label);
        });
      });
    });

    //主机核数
    driver.findElements(By.xpath('//div[@class="cpu-memory"]/ul[@class="cpu"]/li')).then((elms) => {
      elms.forEach((elm) => {
        elm.getText().then((label) => {
          Instance.cpu.push(label);
        });
      });
    });

    //主机内存
    driver.findElements(By.xpath('//div[@class="cpu-memory"]/ul[@class="memory"]/li')).then((elms) => {
      elms.forEach((elm) => {
        elm.getText().then((label) => {
          Instance.memory.push(label);
        });
      });
    });
  });
  return result.getText();
}).then(() => {

  var date = new Date();
  var allInstanceLength = Instance.images.length * Instance.resourceClass.length * Instance.cpu.length * Instance.memory.length;
  var instanceNum = 0;
  var dataStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
  var make = Array.from(4);

  var InstanceConfig = {
    images:'',
    resourceClass:'',
    cpu:'',
    memory:'',
    make:'',
    change:'',
    price:'',
    date: dataStr
  };
  // 存储青云时间表
  var qingyunEntity = new qingyunModel({
    date: dataStr
  });
  qingyunEntity.save((err) => {
    if(err){
      console.log(err);
    }else{
      console.log('插入时间'+dataStr+'成功');
    }
  });

  //注册监听器,Instance爬完之后的函数
  emitter.on('instanceAllPrice',() => {
    mongodb.close();
    //driver.quit();
    //service.stop();
  });

  Instance.images.forEach((image) => {
    driver.findElement(By.linkText(image)).then((elm) => {
      elm.click();
      driver.sleep(100);
      InstanceConfig.images = image;
      make[0] = image.substring(0,1);
    });
    Instance.resourceClass.forEach((resourceClass) => {
      driver.findElement(By.linkText(resourceClass)).then((elm) => {
        elm.click();
        driver.sleep(100);
        InstanceConfig.resourceClass = resourceClass;
        make[1] = resourceClassJSON[resourceClass];
      });
      Instance.cpu.forEach((cpu) => {
        driver.findElement(By.linkText(cpu)).then((elm) => {
          elm.click();
          driver.sleep(100);
          InstanceConfig.cpu = cpu;
          make[2] = 'C' +cpu.match(/\d+/)[0];
        });
        Instance.memory.forEach((memory) => {
          driver.findElement(By.linkText(memory)).then((elm) => {
            elm.click();
            driver.sleep(100);
            InstanceConfig.memory = memory;
            make[3] = 'M' +memory.match(/\d+/)[0];
            InstanceConfig.make = make.join('');
            driver.sleep(1000);
            getPrice((price) => {
              InstanceConfig.price = price;
              InstanceConfig.change = '0';

              console.log(InstanceConfig);
              var mongooseEntity = new mongooseModel(InstanceConfig);
              mongooseEntity.save((err) => {
                if(err){
                  console.log(err);
                }else{
                  console.log('插入第'+instanceNum+'条成功,共有'+allInstanceLength+'条');
                  instanceNum++;
                  if(instanceNum >= allInstanceLength){
                    emitter.emit('instanceAllPrice');
                  }
                }
              });
            })
          });
        })
      })
    });
  });
});