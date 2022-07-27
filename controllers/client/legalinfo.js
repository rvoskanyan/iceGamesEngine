export const legalInfoHomePage = (req, res) => {
   res.render('legalInfoHome', {
      title: 'ICE GAMES — Правовая информация',
      metaDescription: 'Страница ознакомления с правовой информацией сайта интернет-магазина ключей компьютерных игры - ICE GAMES',
   });
}

export const legalInfoAgreementPage = (req, res) => {
   res.render('legalInfoAgreement', {
      title: 'ICE GAMES — Пользовательское соглашение',
      metaDescription: 'Страница ознакомления с пользовательским соглашением при использовании сайта интернет-магазина ключей компьютерных игры - ICE GAMES',
   });
}