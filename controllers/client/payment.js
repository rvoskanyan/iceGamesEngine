export const paymentPage = async (req, res) => {
  try {
    res.render('payment', {
      title: 'ICE Games — Доставка и оплата',
      metaDescription: 'Здесь вы можете ознакомится с условиями доставки и вариантами оплаты',
      isPayment: true,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}