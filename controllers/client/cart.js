import Product from "../../models/Product.js";

export const cartPage = async (req, res) => {
  try {
    const person = res.locals.person;
    let priceToTotal = 0;
    let priceFromTotal = 0;
    let cart = null;
    let is_keys = false;
    let canSplit = false;

    if (!person) {
      return res.redirect('/');
    }

    const result = await person.populate({
      path: 'cart',
      select: [
        'img',
        'dsId',
        'name',
        'priceTo',
        'priceFrom',
        'discount',
        'activationServiceId',
        'activationRegions',
        'preOrder',
        'releaseDate',
        'canSplit',
        'countKeys',
        'description'
      ],
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

    const stockProducts = await Product
      .find({
        _id: { $in: person.cart },
        $or: [{ kupiKodInStock: true }, { countKeys: { $gt: 0 } }]
      })
      .distinct('_id');

    is_keys = { is_keys: Boolean(stockProducts.length), products: stockProducts }
    cart = result.cart;
    priceToTotal = cart.reduce((priceToTotal, item) => priceToTotal + item.priceTo, 0);
    priceFromTotal = cart.reduce((priceFromTotal, item) => {
      return priceFromTotal + (item.discount > 0 ? item.priceFrom : item.priceTo);
    }, 0);
    cart = cart.map(product => {
      const canCurrentSplit = product.canSplit && product.countKeys > 0;

      if (canCurrentSplit) {
        canSplit = true;
      }

      const shortDescription = product.description.replace(/<h[2-6]>.+<\/h[2-6]>/ig, '').replace(/<[^>]+>/ig, '').replace(/\s{2,}/ig, ' ').trim().slice(0, 200).trim();

      return {
        ...product.toObject(),
        canSplit: canCurrentSplit,
        shortDescription: shortDescription
      }
    });

    res.render('cart', {
      title: 'ICE GAMES — корзина покупок',
      metaDescription: 'Корзина для покупок в ICE GAMES. Все Ваши игры со скидками хранятся здесь.',
      ogPath: 'cart',
      noIndex: true,
      noIndexGoogle: true,
      isCart: true,
      hideMobileCart: true,
      is_auth: res.locals.isAuth || false,
      is_keys,
      cart: {
        items: cart,
        priceToTotal,
        priceFromTotal,
        saving: priceFromTotal - priceToTotal,
      },
      breadcrumbs: [{
        name: 'Корзина',
        current: true,
      }],
      canSplit
    });
  } catch (e) {
    console.log(e);
    res.redirect('/');
  }
}
