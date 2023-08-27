export const paymentPage = async (req, res) => {
  res.render('payment', {
    title: 'Доставка и оплата — ICE GAMES',
    metaDescription: 'Лучшие ключи «Стим» в магазине компьютерных игр ICE GAMES. Ознакомьтесь с условиями оплаты и получения. Доставка мгновенная!',
    ogPath: 'payment',
    isPayment: true,
    breadcrumbs: [{
      name: 'Доставка и оплата',
      current: true,
    }],
  });
}