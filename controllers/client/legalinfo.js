export const legalInfoHomePage = (req, res) => {
   res.render('legalInfoHome', {
      title: 'ICE GAMES — Правовая информация',
      metaDescription: 'Страница ознакомления с правовой информацией сайта интернет-магазина ключей компьютерных игры - ICE GAMES',
      ogPath: 'legal-info',
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
      ogPath: 'legal-info/agreement',
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
      ogPath: 'legal-info/privacy-policy',
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

export const licenseAgreementOfferPage = (req, res) => {
   res.render('licenseAgreementOfferPage', {
      title: 'ICE GAMES — Лицензионный договор-оферта',
      metaDescription: 'Страница ознакомления с лицензионным договором-оферты при использовании сайта интернет-магазина ключей компьютерных игры - ICE GAMES',
      ogPath: 'legal-info/license-agreement-offer',
      breadcrumbs: [
         {
            name: 'Правовая информация',
            path: 'legal-info',
         },
         {
            name: 'Лицензионный договор-оферта',
            current: true,
         },
      ],
   });
}

export const serviceOfferAgreementPage = (req, res) => {
   res.render('serviceOfferAgreement', {
      title: 'ICE GAMES — Договор-оферта оказания услуг',
      metaDescription: 'Страница ознакомления с договором-оферта оказания услуг при использовании сайта интернет-магазина ключей компьютерных игры - ICE GAMES',
      ogPath: 'legal-info/service-offer-agreement',
      breadcrumbs: [
         {
            name: 'Правовая информация',
            path: 'legal-info',
         },
         {
            name: 'Договор-оферта оказания услуг',
            current: true,
         },
      ],
   });
}

export const publicOfferForUseYaSplitPage = (req, res) => {
   res.render('publicOfferForUseYaSplitPage', {
      title: 'ICE GAMES — Публичная оферта ИП Колпаков Игорь Сергеевич о покупке товаров с использованием сервиса Яндекс Сплит',
      metaDescription: 'ICE GAMES — Страница ознакомления с публичной офертой ИП Колпаков Игорь Сергеевич о покупке товаров с использованием сервиса Яндекс Сплит',
      ogPath: 'legal-info/public-offer-for-use-ya-split',
      breadcrumbs: [
         {
            name: 'Правовая информация',
            path: 'legal-info',
         },
         {
            name: 'Публичная оферта ИП Колпаков Игорь Сергеевич о покупке товаров с использованием сервиса Яндекс Сплит',
            current: true,
         },
      ],
   });
}