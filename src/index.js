const request = require('request-promise-native')
const config = require('config')
const mailer = require('./mailer')

const urls = config.get('urls')
const interval = config.get('checkInterval')

const check = async() => {
  for (let i = 0; i < urls.length; i++) {
    const item = urls[i]
    try {
      await request(item.url)
    } catch (err) {
      mailer.send({
        to: item.mailTo,
        appname: item.appname,
        error: err + ''
      })      
    }
  } 

  // setTimeout(check, interval) 
}

check()