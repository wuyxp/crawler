var events = require('events');
var emitter = new events.EventEmitter();

var db = require('../db/qingyun');
var mongooseModel = db.mongodb.model('qingyun_instance', db.qingyunScheMaInstance); //  与users集合关联

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

  var date = new Date();
  var allInstanceLength = Instance.images.length * Instance.resourceClass.length * Instance.cpu.length * Instance.memory.length;
  var instanceNum = 0;

  var InstanceConfig = {
    images:'',
    resourceClass:'',
    cpu:'',
    memory:'',
    price:'',
    date: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
  };

  //注册监听器,Instance爬完之后的函数
  emitter.on('instanceAllPrice',() => {
    db.mongodb.close();
    driver.quit();
    service.stop();
  });

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
console.log(Instance);
