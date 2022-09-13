export const legalInfoHomePage = (req, res) => {
   res.render('legalInfoHome', {
      title: 'ICE GAMES — Правовая информация',
      metaDescription: 'Страница ознакомления с правовой информацией сайта интернет-магазина ключей компьютерных игры - ICE GAMES',
      breadcrumbs: [{
         name: 'Правовая информация',
         current: true,
      }],
   });
}

export const legalInfoAgreementPage = (req, res) => {
   res.render('legalInfoAgreement', {
      title: 'ICE GAMES — Пользовательское соглашение',
      metaDescription: 'Страница ознакомления с пользовательским соглашением при использовании сайта интернет-магазина ключей компьютерных игры - ICE GAMES',
      breadcrumbs: [
         {
            name: 'Правовая информация',
            path: 'legal-info',
         },
         {
            name: 'Пользовательское соглашение',
            current: true,
         },
      ],
   });
}

export const privacyPolicyPage = (req, res) => {
   res.render('privacyPolicy', {
      title: 'ICE GAMES — Политика конфиденциальности',
      metaDescription: 'Страница ознакомления с политикой конфиденциальности при использовании сайта интернет-магазина ключей компьютерных игры - ICE GAMES',
      breadcrumbs: [
         {
            name: 'Правовая информация',
            path: 'legal-info',
         },
         {
            name: 'Политика конфиденциальности',
            current: true,
         },
      ],
   });
}