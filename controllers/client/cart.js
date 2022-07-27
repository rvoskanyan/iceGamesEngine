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
      priceFromTotal = cart.reduce((priceFromTotal, item) => {
        return priceFromTotal + (item.discount > 0 ? item.priceFrom : item.priceTo);
      }, 0);
    }
    
    res.render('cart', {
      title: 'ICE GAMES — корзина покупок',
      metaDescription: 'Корзина для покупок в ICE GAMES. Все Ваши игры со скидками хранятся здесь.',
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