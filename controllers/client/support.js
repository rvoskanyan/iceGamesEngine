import Faq from "./../../models/Faq.js";

export const supportPage = async (req, res) => {
  try {
    const faqs = Faq.find();
    
    res.render('support', {
      title: 'Поддержка — ICE GAMES',
      metaDescription: 'Проблемы с активацией? Напишите в наш чат с оперативной поддержкой. Поможем с решением любых вопросов.',
      ogPath: 'support',
      isSupport: true,
      breadcrumbs: [{
        name: 'Поддержка',
        current: true,
      }],
      faqs,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}