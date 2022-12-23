import Order from './../../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const person = res.locals.person;
    const dsCartId = req.body.dsCartId;
    const orderId = req.body.orderId;
    const email = req.body.email;
    const isTwo = req.body.isTwo;
    let order;
    
    if (!person || !person.cart.length) {
      throw new Error('Not found person or products in cart');
    }
    
    if (!dsCartId) {
      throw new Error('no cart id specified');
    }
    
    if (orderId) {
      order = await Order.findById(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }
    } else {
      order = new Order({
        products: [],
        status: 'notPaid',
        paymentType: isTwo ? 'mixed' : 'ds',
      });
    }
    
    if (order.paymentType === 'dbi') {
      throw new Error('incorrect payment type');
    }
    
    order.dsCartId = dsCartId;
    
    if (order.paymentType === 'ds' && req.session.isAuth) {
      order.userId = req.session.userId;
      order.buyerEmail = person.email || email;
    }
    
    person.cart.forEach(item => {
      order.products.push({
        productId: item,
      });
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