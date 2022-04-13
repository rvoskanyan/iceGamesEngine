export const paymentPage = async (req, res) => {
  try {
    res.render('payment', {
      title: 'ICE Games -- Доставка и оплата',
      isPayment: true,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}