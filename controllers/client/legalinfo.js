export const legalInfoHomePage = (req, res) => {
   res.render('legalInfoHome', {
      title: 'ICE Games — Правовая информация',
      metaDescription: 'Правовая информация сайта интернет-магазина ключей компьютерных игры - ICE Games',
   });
}

export const legalInfoAgreementPage = (req, res) => {
   res.render('legalInfoAgreement', {
      title: 'ICE Games — Пользовательское соглашение',
      metaDescription: 'Соглашение при использовании сайта интернет-магазина ключей компьютерных игры - ICE Games',
   });
}