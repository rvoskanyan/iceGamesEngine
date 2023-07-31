import nodemailer from 'nodemailer';
import Product from "../models/Product.js";
import sharp from 'sharp';
import path from "path";
import {__dirname} from "../rootPathes.js";
import {v4 as uuidv4} from "uuid";

const fromMail = 'support@icegames.store';

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    auth: {
        user: fromMail,
        pass: 'ghD9tBgbmnbS7RaW1rA6',
    },
    secure: true,
    port: 465,
    tls: {
        rejectUnauthorized: false
    },
});

export async function registrationMail(to, hash) {
    await transporter.sendMail({
        from: `ICE GAMES <${fromMail}>`,
        to: to,//'user@example.com, user@example.com',
        subject: 'Подтверждение E-mail',
        html: `
      <p>
        Здравствуйте! Вы успешно зарегистрировались на ICE GAMES. Для продолжения работы Вам необходимо подтвердить свой
        адрес электронной почты, для этого перейдите по данной
        <a href="${process.env.WEB_SITE_ADDRESS}?confirmEmail=${hash}">ссылке.</a>
      </p>
      <p>Если Вы не создавали данный аккаунт, пожалуйста, проигноррируйте это письмо.</p>
      <p>С уважением, команда <a href="${process.env.WEB_SITE_ADDRESS}">ICE GAMES</a>!</p>
    `,
    })
}

export async function restoreMail(to, password) {
    await transporter.sendMail({
        from: `ICE GAMES <${fromMail}>`,
        to: to,
        subject: 'Смена пароля',
        html: `
      <p>Здравствуйте! Вы успешно изменили свой пароль на ICE GAMES. Для авторизации используйте следующие данные:</p>
      <p><b>E-mail:</b> <i>${to}</i></p>
      <p><b>Пароль:</b> <i>${password}</i></p>
      <p>Если Вы не выполняли данного действия, пожалуйста, обратитесь в <a href="https://vk.com/ice.games">поддержку</a>.</p>
      <p>С уважением, команда <a href="${process.env.WEB_SITE_ADDRESS}">ICE GAMES</a>!</p>
    `,
    })
}

export async function autoChangePrice(product, newPrice, purchasePrice) {
    await transporter.sendMail({
        from: `ICE GAMES <${fromMail}>`,
        to: 'juliakunschikova@gmail.com, igorek040602@mail.ru',
        subject: 'Автоматическое изменение цены',
        html: `
      <p>Внимание! Была автоматически изменена цена на товар ${product.name}: ${product.priceTo} -> ${newPrice}</p>
      <p>Текущая цена закупа у Купи-Код: ${purchasePrice}</p>
      <p>
        <a href="${process.env.WEB_SITE_ADDRESS}admin/products/edit/${product._id}">Перейти к редактированию товара</a>
      </p>
    `,
    })
}

export async function outStockProduct(product) {
    await transporter.sendMail({
        from: `ICE GAMES <${fromMail}>`,
        to: 'juliakunschikova@gmail.com, igorek040602@mail.ru',
        subject: 'Заканчиваются ключи на складе',
        html: `
      <p>Внимание! Заканчиваются ключи к игре ${product.name}.</p>
      <p>Оставшееся количество: ${product.countKeys}</p>
      <p>
        <a href="${process.env.WEB_SITE_ADDRESS}admin/products/edit/${product._id}">Перейти к редактированию товара</a>
      </p>
    `,
    })
}

export async function mailingBuyTurkeyFillUpKey({ value, denomination, email }) {
    const websiteAddress = process.env.WEB_SITE_ADDRESS;
    
    await transporter.sendMail({
        from: `ICE GAMES <${fromMail}>`,
        to: email,
        subject: 'Код подарочной карты на пополнение Турецкого Steam аккаунта',
        html: `
            <p>Благодарим Вас за покупку на <a href="${websiteAddress}" style="text-decoration: underline">ICEGAMES.STORE</a></p>
            <p>
              Вы приобрели код подарочной карты на пополнение Турецкого Steam аккаунта с номиналом ${denomination}₺.<br>
              Мы очень рады, что Вы выбрали нас!<br><br>
              Ваш код: ${value}
            </p>
        `,
    })
}

export async function mailingBuyProduct({product, email, key = null}) {
    const websiteAddress = process.env.WEB_SITE_ADDRESS;
    
    if (!product.darkenCover) {
        product.darkenCover = `${uuidv4()}.jpg`;
        
        await product.save();
    }
    
    await sharp(path.join(__dirname, `/uploadedFiles/${product.coverImg}`))
        .resize(600, 345)
        .composite([
            {input: path.join(__dirname, '/layout/img/darken.svg')},
        ])
        .toFile(path.join(__dirname, `/uploadedFiles/${product.darkenCover}`));

    await transporter.sendMail({
        from: `ICE GAMES <${fromMail}>`,
        to: email,
        subject: `Спасибо за покупку ${product.name}!`,
        html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>HTML Template</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,600;1,300;1,600&display=swap" rel="stylesheet">
          <style>
              body {
                  width: 100% !important;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                  margin: 0;
                  padding: 0;
                  line-height: 100%;
              }
      
              [style*="Open Sans"] {font-family: 'Open Sans', arial, sans-serif !important;}
      
              img {
                  outline: none;
                  text-decoration: none;
                  border:none;
                  -ms-interpolation-mode: bicubic;
                  max-width: 100%!important;
                  margin: 0;
                  padding: 0;
                  display: block;
              }
      
              table td {
                  border-collapse: collapse;
              }
      
              table {
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
              }
          </style>
      </head>
      
      <body style="margin: 0; padding: 0;">
      <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ededed">
          <tr>
              <td>
                  <table class="main" cellpadding="0" cellspacing="0" width="600" align="center" bgcolor="#02043D">
                      <tr>
                          <td>
                              <img src="${websiteAddress}${product.darkenCover}" alt="Обложка">
                          </td>
                      </tr>
                      <tr>
                          <td align="center">
                              <a href="${websiteAddress}">
                                  <img src="${websiteAddress}img/fullLogo.png" alt="Логотип Ice Games">
                              </a>
                          </td>
                      </tr>
                      <tr>
                          <td align="center">
                              <h1 style="color: #ffffff; text-align: center; width: 500px; font-size: 24px; line-height: 1.1; font-family: Montserrat, arial, sans-serif !important;">
                                  Благодарим Вас за покупку на <br>
                                  <a href="${websiteAddress}" style="color: #fff; text-decoration: underline">ICEGAMES.STORE</a>
                              </h1>
                              <p style="color: #ffffff; text-align: center; width: 310px; font-size: 16px; font-family: Montserrat, arial, sans-serif !important; line-height: 20px">
                                  Вы приобрели игру ${product.name} с активацией в ${product.activationServiceId.name}.<br>
                                  Мы очень рады, что Вы выбрали нас!
                                  ${key && `<br><br>Ваш ключ: ${key}`}
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding-bottom: 50px">
                              <img src="${websiteAddress}img/anchorLink.png" style="display: inline-block; width: 9px; height: 11px" alt="Иконка якоря ссылки">
                              <a href="${websiteAddress}blog/kak-aktivirovat-klyuch-v-steam-origin-i-uplay" style="color: rgba(255,255,255,0.5); font-family: Montserrat, arial, sans-serif !important; font-size: 14px">Инструкция по активации ключа</a>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding-bottom: 30px">
                              <table width="500">
                                  <tr>
                                      <td align="center" style="padding-top: 20px; padding-bottom: 20px; background: #320065; border-radius: 10px">
                                          <table>
                                              <tr>
                                                  <td align="center" colspan="5" >
                                                      <h2 style="color: #ffffff; padding-bottom: 5px; text-align: center; width: 400px; font-size: 19px; line-height: 1.1; margin: 0; font-family: Montserrat, arial, sans-serif !important;">Оставайтесь с нами и будьте в курсе скидок, розыгрышей и акций</h2>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td align="center" colspan="5">
                                                      <a href="${websiteAddress}" style="color: #ffffff; font-size: 19px; font-weight: 700; font-family: Montserrat, arial, sans-serif !important;">icegames.store</a>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td height="30"></td>
                                              </tr>
                                              <tr>
                                                  <td align="center">
                                                      <a href="https://vk.com/ice.games">
                                                          <img src="${websiteAddress}img/vkSocial.png" alt="Логотип VK" title="Перейти на страницу Ice Games в VK">
                                                      </a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://t.me/icegames_store">
                                                          <img src="${websiteAddress}img/telegramSocial.png" alt="Логотип Telegram" title="Перейти на страницу Ice Games в Telegram">
                                                      </a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://m.twitch.tv/surf1se/about">
                                                          <img src="${websiteAddress}img/twitchSocial.png" alt="Логотип Twitch" title="Перейти на страницу Ice Games в Twitch">
                                                      </a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://www.youtube.com/channel/UCMARO--DvWrjVlbVflNtczA">
                                                          <img src="${websiteAddress}img/youtubeSocial.png" alt="Логотип YouTube" title="Перейти на страницу Ice Games в YouTube">
                                                      </a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://vt.tiktok.com/ZSRRFmTSm/">
                                                          <img src="${websiteAddress}img/tiktokSocial.png" alt="Логотип TikTok" title="Перейти на страницу Ice Games в TikTok">
                                                      </a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://instagram.com/icegames.store">
                                                          <img src="${websiteAddress}img/instagramSocial.png" alt="Логотип Instagram" title="Перейти на страницу Ice Games в Instagram">
                                                      </a>
                                                  </td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
      </body>
      </html>
    `,
    })
}

export async function mailingInStockProduct(productId, emails) {
    const product = await Product.findById(productId);
    const websiteAddress = process.env.WEB_SITE_ADDRESS;

    if (!product.darkenCover) {
        product.darkenCover = `${uuidv4()}.jpg`;

        await product.save();
    }

    await sharp(path.join(__dirname, `/uploadedFiles/${product.coverImg}`))
        .resize(600, 345)
        .composite([
            {input: path.join(__dirname, '/layout/img/darken.svg')},
        ])
        .toFile(path.join(__dirname, `/uploadedFiles/${product.darkenCover}`));

    await transporter.sendMail({
        from: `ICE GAMES <${fromMail}>`,
        to: emails.join(', '),
        subject: `${product.name} снова в наличии!`,
        html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>HTML Template</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,600;1,300;1,600&display=swap" rel="stylesheet">
          <style>
              body {
                  width: 100% !important;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                  margin: 0;
                  padding: 0;
                  line-height: 100%;
              }
      
              [style*="Open Sans"] {font-family: 'Open Sans', arial, sans-serif !important;}
      
              img {
                  outline: none;
                  text-decoration: none;
                  border:none;
                  -ms-interpolation-mode: bicubic;
                  max-width: 100%!important;
                  margin: 0;
                  padding: 0;
                  display: block;
              }
      
              table td {
                  border-collapse: collapse;
              }
      
              table {
                  border-collapse: collapse;
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
              }
          </style>
      </head>
      <body style="margin: 0; padding: 0;">
      <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ededed">
          <tr>
              <td>
                  <table class="main" cellpadding="0" cellspacing="0" width="600" align="center" bgcolor="#02043D">
                      <tr>
                          <td>
                              <img src="${websiteAddress}${product.darkenCover}" alt="Обложка">
                          </td>
                      </tr>
                      <tr>
                          <td align="center">
                              <a href="${websiteAddress}">
                                  <img src="${websiteAddress}img/fullLogo.png" alt="Логотип Ice Games">
                              </a>
                          </td>
                      </tr>
                      <tr>
                          <td align="center">
                              <h1 style="color: #ffffff; text-align: center; width: 500px; font-size: 24px; line-height: 1.1; font-family: Montserrat, arial, sans-serif !important;">Игра ${product.name} поступила в продажу</h1>
                              <p style="color: #ffffff; text-align: center; width: 300px; font-size: 16px; font-family: Montserrat, arial, sans-serif !important; line-height: 20px">Благодарим за ожидание, будем рады видеть Вас у нас на сайте.</p>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding-bottom: 50px">
                              <a href="${websiteAddress}games/${product.alias}" style="background-color: #C745CB; color: #ffffff; text-decoration: none; text-align: center; font-family: Montserrat, arial, sans-serif !important; font-weight: 700; border-color: #C745CB; border-radius: 8px; border-style: solid; border-width: 12px 20px 12px 20px; display: inline-block;">Перейти к игре</a>
                          </td>
                      </tr>
                      <tr>
                          <td align="center" style="padding-bottom: 30px">
                              <table width="500">
                                  <tr>
                                      <td align="center" style="padding-top: 20px; padding-bottom: 20px; background: #320065; border-radius: 10px">
                                          <table>
                                              <tr>
                                                  <td align="center" colspan="5" >
                                                      <h2 style="color: #ffffff; padding-bottom: 5px; text-align: center; width: 400px; font-size: 19px; line-height: 1.1; margin: 0; font-family: Montserrat, arial, sans-serif !important;">Оставайтесь с нами и будьте в курсе скидок, розыгрышей и акций</h2>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td align="center" colspan="5">
                                                      <a href="${websiteAddress}" style="color: #ffffff; font-size: 19px; font-weight: 700; font-family: Montserrat, arial, sans-serif !important;">icegames.store</a>
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td height="30"></td>
                                              </tr>
                                              <tr>
                                                  <td align="center">
                                                      <a href="https://vk.com/ice.games">
                                                          <img src="${websiteAddress}img/vkSocial.png" alt="Логотип VK" title="Перейти на страницу Ice Games в VK">
                                                      </a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://t.me/icegames_store">
                                                          <img src="${websiteAddress}img/telegramSocial.png" alt="Логотип Telegram" title="Перейти на страницу Ice Games в Telegram">
                                                      </a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://m.twitch.tv/surf1se/about">
                                                          <img src="${websiteAddress}img/twitchSocial.png" alt="Логотип Twitch" title="Перейти на страницу Ice Games в Twitch">
                                                      </a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://www.youtube.com/channel/UCMARO--DvWrjVlbVflNtczA">
                                                          <img src="${websiteAddress}img/youtubeSocial.png" alt="Логотип YouTube" title="Перейти на страницу Ice Games в YouTube">
                                                      </a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://vt.tiktok.com/ZSRRFmTSm/">
                                                          <img src="${websiteAddress}img/tiktokSocial.png" alt="Логотип TikTok" title="Перейти на страницу Ice Games в TikTok">
                                                      </a>
                                                  </td>
                                                  <td align="center">
                                                      <a href="https://instagram.com/icegames.store">
                                                          <img src="${websiteAddress}img/instagramSocial.png" alt="Логотип Instagram" title="Перейти на страницу Ice Games в Instagram">
                                                      </a>
                                                  </td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
      </body>
      </html>
    `,
    })
}

export async function sendConfirmCode(email, code) {
    await transporter.sendMail({
        from: `ICE GAMES <${fromMail}>`,
        to: email,
        subject: `Подтверждение почты`,
        text: "Ваш код подтверждения: " + code
    })
}

export async function sendUserAuthData(email, password) {
    await transporter.sendMail({
        from: `ICE GAMES <${fromMail}>`,
        to: email,
        subject: `Успешно подтверждено`,
        text: "Вы успешно подтвердили почту! Для ващего удобства мы создали и сгенерировали для вас аккаунт чтобы вам не " +
            "приходилось при следующих покупках вводить свой e-mail и подтверждать его.\n\n" +
            "Ващь логин: " + email + "\n" +
            "Ващь пароль: " + password
    })
}