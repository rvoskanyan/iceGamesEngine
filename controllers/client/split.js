export const splitInfoPage = (req, res) => {
  res.render('splitInfoPage', {
    title: 'Что такое сплит — ICE GAMES',
    metaDescription: 'Что такое сплит в магазине компьютерных игр ICE GAMES. Ознакомьтесь с условиями оплаты и получения.',
    ogPath: 'split',
    breadcrumbs: [{
      name: 'Что такое сплит',
      current: true,
    }],
  });
}