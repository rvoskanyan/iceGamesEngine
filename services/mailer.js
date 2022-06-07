import nodemailer from 'nodemailer';

export async function registration(to) {
  const testEmailAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 465,
    secure: true,
    auth: {
      user: testEmailAccount.user,
      pass: testEmailAccount.pass,
    },
  });
  
  await transporter.sendMail({
    from: '"ICE Games" <admin@icegames.store>',
    to: to,//'user@example.com, user@example.com',
    subject: 'Подтверждение e-mail',
    text: 'This message was sent from Node js server.',
    //html: 'This <i>message</i> was sent from <strong>Node js</strong> server.',
  })
}