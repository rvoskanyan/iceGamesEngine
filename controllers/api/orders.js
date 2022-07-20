import Order from './../../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const person = res.locals.person;
    const dsCartId = req.body.dsCartId;
    
    if (!person || !person.cart.length) {
      throw new Error('Not found person or products in cart');
    }
    
    const order = new Order({
      products: [],
      status: 'notPaid',
      dsCartId,
    });
    
    if (req.session.isAuth) {
      order.userId = req.session.userId;
      order.buyerEmail = person.email;
    }
    
    person.cart.forEach(item => {
      order.products.push({
        productId: item,
      });
    })
    
    person.cart = [];
    await order.save();
    await person.save();
    
    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
    });
  }
}