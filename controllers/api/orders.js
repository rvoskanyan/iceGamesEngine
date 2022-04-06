const Order = require('./../../models/Order');

const createOrder = async (req, res) => {
  try {
    const person = res.locals.person;
    
    if (!person || !person.cart.length || !person.dsCartId) {
      throw new Error('Not found person or products in cart or dsCartId');
    }
    
    const order = new Order({
      dsCartId: person.dsCartId,
      products: [],
      status: 'notPaid',
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
    
    await order.save();
    
    person.dsCartId = "";
    person.cart = [];
    
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

module.exports = {
  createOrder,
}