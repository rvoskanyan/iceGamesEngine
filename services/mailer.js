import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.icegames.store',
  secure: true,
  auth: {
    user: 'info@icegames.store',
    pass: 'qwertyuiop-.2020',
  },
});

export async function registrationMail(to, hash) {
  await transporter.sendMail({
    from: 'ICE Games <info@icegames.store>',
    to: to,//'user@example.com, user@example.com',
    subject: 'Подтверждение E-mail',
    html: `
        <p>
            Здравствуйте! Вы успешно зарегистрировались на ICE Games. Для продолжения работы Вам необходимо подтвердить свой
            адрес электронной почты, для этого перейдите по данной
            <a href="${process.env.WEB_SITE_ADDRESS}?confirmEmail=${hash}">ссылке.</a>
        </p>
        <p>Если Вы не создавали данный аккаунт, пожалуйста, проигноррируйте это письмо.</p>
        <p>С уважением, команда <a href="${process.env.WEB_SITE_ADDRESS}">ICE Games</a>!</p>
    `,
  })
}