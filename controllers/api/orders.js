import Order from './../../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const dsCartId = req.body.dsCartId;
    const email = req.body.email;
    const isAuth = req.session.isAuth;
    const person = res.locals.person;
    
    if (!isAuth && !email) {
      throw new Error('Email for not auth users is required');
    }
    
    if (!person || !person.cart.length) {
      throw new Error('Not found person or products in cart');
    }
    
    if (!dsCartId) {
      throw new Error('No cart id specified');
    }
  
    const order = new Order({
      items: [],
      buyerEmail: person.email || email,
      userId: isAuth ? req.session.userId : undefined,
      dsCartId,
    });
    
    person.cart.forEach(item => {
      order.items.push({productId: item});
    });
    
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