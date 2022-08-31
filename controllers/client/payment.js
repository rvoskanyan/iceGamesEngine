export const paymentPage = async (req, res) => {
  try {
    res.render('payment', {
      title: 'ICE GAMES — Доставка и оплата',
      metaDescription: 'Лучшие ключи Стим с быстрой доставкой в магазине компьютерных игр ICE GAMES. Ознакомьтесь с условиями оплаты и получения!',
      isPayment: true,
      breadcrumbs: [{
        name: 'Доставка и оплата',
        current: true,
      }],
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}