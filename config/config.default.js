/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1715146517135_8011';

  // add your middleware config here
  config.middleware = [];

  // CSRF
  config.security = {
    csrf: {
      enable: false,
    }
  }

  // 生成token
  config.jwt = {
    // 加密字符串
    'secret': "123456" // 秘钥
  }

  config.cors = {
    origin: 'http://127.0.0.1:8080',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mysql = {
    app: true,
    agent: false,
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '020503',
      database: 'mems-data'
    }
  }
  
  return {
    ...config,
    ...userConfig,
  };
};
