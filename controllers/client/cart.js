export const cartPage = async (req, res) => {
  try {
    const person = res.locals.person;
    let priceToTotal = 0;
    let priceFromTotal = 0;
    let cart = null;
    
    if (person) {
      const result = await person
        .populate({
          path: 'cart',
          select: ['img', 'dsId', 'name', 'priceTo', 'priceFrom', 'discount', 'activationServiceId', 'activationRegions', 'preOrder', 'releaseDate'],
          populate: [
            {
              path: 'activationServiceId',
              select: 'name',
            },
            {
              path: 'activationRegions',
              select: 'name',
            }
          ]
        });
      
      cart = result.cart;
      priceToTotal = cart.reduce((priceToTotal, item) => priceToTotal + item.priceTo, 0);
      priceFromTotal = cart.reduce((priceFromTotal, item) => priceFromTotal + item.priceFrom, 0);
    }
    
    res.render('cart', {
      title: 'ICE Games — корзина покупок',
      metaDescription: 'Быстрая покупайте игры со скидками, добавленных сюда!',
      isCart: true,
      cart: {
        items: cart,
        priceToTotal,
        priceFromTotal,
        saving: priceFromTotal - priceToTotal,
      },
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}