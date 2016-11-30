var http = require("http");
var https = require('https');


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


var getPrice = function(){
  driver.findElement(By.className('price')).then(function(elm){
    return elm.getText();
  }).then(function(price){
    console.log(price);
  });
};

var getPanelList = function(){
  driver.findElement(By.className('panel')).then(function(){

  })
}
var Instance = {
  images : [],
  resourceClass: [],
  cpu: [],
  memory: []
};

driver.get('https://www.qingcloud.com/pricing/plan').then(() => {
  return driver.getTitle();
}).then((result) => {
  getPrice();
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
    driver.findElement(By.className('resource-class')).then(() => {
      driver.findElements(By.className('class-item')).then((elm) => {
        return elm.getText();
      }).then((label) => {
        Instance.resourceClass.push(label);
      });
    });

    //主机核数
    driver.findElement(By.className('cpu')).then((elm) => {
      return elm.getText();
    }).then((label) => {
      console.log(label);
      Instance.cpu = label.split(/\s+/);
    });

    //主机内存
    driver.findElement(By.className('memory')).then((elm) => {
      return elm.getText();
    }).then((label) => {
      console.log(label);
      Instance.memory = label.split(/\s+/);
    });

  });
  return result.getText();
}).then((text) => {
  //console.log(text);
  console.log(Instance);
  driver.quit();
  service.stop();
});
console.log(Instance);
