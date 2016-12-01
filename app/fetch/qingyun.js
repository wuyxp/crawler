//var db = require('../db/qingyun');
var mongoose = require('mongoose');
//数据库连接类
var mongodb = mongoose.connect('mongodb://127.0.0.1:27017/crawler');//；连接数据库
var Schema = mongoose.Schema;   //  创建模型
var qingyunScheMa = new Schema({
  name: String,
  password: String
}); //  定义了一个新的模型，但是此模式还未和users集合有关联
var mongooseModel = mongodb.model('qingyun_host', qingyunScheMa); //  与users集合关联


//webdriver生命类
var webdriver = require('selenium-webdriver'),
  chrome = require('selenium-webdriver/chrome'),
  By = webdriver.By,
  until = webdriver.until;
var path = require('chromedriver').path;

var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

var driver = new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

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
  var InstanceConfig = {
    images:'',
    resourceClass:'',
    cpu:'',
    memory:'',
    price:''
  };
  Instance.images.forEach((image) => {
    driver.findElement(By.linkText(image)).then((elm) => {
      elm.click();
      driver.sleep(100);
      InstanceConfig.images = image;
    });
    Instance.resourceClass.forEach((resourceClass) => {
      driver.findElement(By.linkText(resourceClass)).then((elm) => {
        elm.click();
        driver.sleep(100);
        InstanceConfig.resourceClass = resourceClass;
      });
      Instance.cpu.forEach((cpu) => {
        driver.findElement(By.linkText(cpu)).then((elm) => {
          elm.click();
          driver.sleep(100);
          InstanceConfig.cpu = cpu;
        });
        Instance.memory.forEach((memory) => {
          driver.findElement(By.linkText(memory)).then((elm) => {
            elm.click();
            driver.sleep(1000);
            InstanceConfig.memory = memory;
            getPrice((price) => {
              InstanceConfig.price = price;
              console.log(InstanceConfig);
              var mongooseEntity = new mongooseModel(InstanceConfig);
              mongooseEntity.save((err) => {
                if(err){
                  console.log(err);
                }else{
                  console.log('插入一条成功');
                }
              })
              //var str = '配置为:'+InstanceConfig+', === 价格为:---->'+price + '\n';
              //console.log(str);
              //db.write(str);
            })
          });
        })
      })
    });
  });
  //driver.quit();
  //service.stop();
});
console.log(Instance);
