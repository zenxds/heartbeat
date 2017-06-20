const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')
const mailConfig = require('config').get('mail')
const htmlTpl = fs.readFileSync(path.join(__dirname, 'template/html.txt'), 'utf8')
const textTpl = fs.readFileSync(path.join(__dirname, 'template/text.txt'), 'utf8')

const transporter = nodemailer.createTransport(`smtps://noreply%40dingxiang-inc.com:${mailConfig.password}@smtp.exmail.qq.com`, {
  from: mailConfig.from
})

module.exports = {
  /**
   * options: to, appname, error
   */
  send: (options) => {
    const mailOptions = {
      to: options.to,
      subject: `${options.appname} 心跳监测失败`,
      text: substitute(textTpl, {
        appname: options.appname,
        error: options.error
      }),
      html: substitute(htmlTpl, {
        appname: options.appname,
        error: options.error
      })
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      }
    })
  }
}

function substitute(str, o) {
  return str.replace(/\\?\{\{\s*([^{}\s]+)\s*\}\}/g, function (match, name) {
    if (match.charAt(0) === '\\') {
      return match.slice(1)
    }
    return (o[name] == null) ? '' : o[name]
  })
}