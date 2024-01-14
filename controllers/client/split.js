import { getFormatDate } from "../../utils/functions.js";

export const splitInfoPage = (req, res) => {
  const currentDate = new Date();
  const one = getFormatDate(currentDate, ' ', ['d', 'm'], true);
  
  currentDate.setDate(currentDate.getDate() + 14);
  const two = getFormatDate(currentDate, ' ', ['d', 'm'], true);
  
  currentDate.setDate(currentDate.getDate() + 14);
  const three = getFormatDate(currentDate, ' ', ['d', 'm'], true);
  
  currentDate.setDate(currentDate.getDate() + 14);
  const four = getFormatDate(currentDate, ' ', ['d', 'm'], true);
  
  res.render('splitInfoPage', {
    title: 'Что такое сплит — ICE GAMES',
    metaDescription: 'Что такое сплит в магазине компьютерных игр ICE GAMES. Ознакомьтесь с условиями оплаты и получения.',
    ogPath: 'split',
    breadcrumbs: [{
      name: 'Что такое сплит',
      current: true,
    }],
    one,
    two,
    three,
    four,
  });
}