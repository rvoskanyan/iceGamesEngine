import Faq from "./../../models/Faq.js";

export const supportPage = async (req, res) => {
  try {
    const faqs = Faq.find();
    
    res.render('support', {
      title: 'ICE GAMES — Поддержка',
      metaDescription: 'Проблемы с активацией? Поможем с решением любых вопросов в чате с оперативной поддержкой.',
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