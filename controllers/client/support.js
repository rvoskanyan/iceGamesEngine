import Faq from "./../../models/Faq.js";

export const supportPage = async (req, res) => {
  try {
    const faqs = Faq.find();
    
    res.render('support', {
      title: 'ICE Games -- Поддержка',
      isSupport: true,
      faqs,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}