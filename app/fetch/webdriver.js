/**
 * Created by wuyang on 2016/12/2.
 */
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

module.exports = {
  By,
  driver,
  service
}
