import Order from './../../models/Order.js';
import fetch from "node-fetch";

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

export const createSplitOrder = async (req, res) => {
  try {
    const isAuth = req.session.isAuth;
    const person = res.locals.person;
    const { yaClientId } = req.body;
  
    if (!isAuth) {
      throw new Error('Email for not auth users is required');
    }
  
    if (!person || !person.cart.length) {
      throw new Error('Not found person or products in cart');
    }
    
    if (yaClientId) {
      person.yaClientIds.addToSet(yaClientId);
    }
    
    await person.populate([{ path: 'cart' }]);
  
    const order = new Order({
      items: [],
      userId: person._id,
      isDBI: true,
      isSplit: true,
      buyerEmail: person.email,
      yaClientId: yaClientId ? yaClientId : undefined,
    });
    
    let totalAmount = 0;
    
    const cartItems = person.cart
      .filter(item => item.canSplit && item.countKeys > 0)
      .map(item => {
        const total = Math.floor(item.priceTo + item.priceTo / 100 * 6);
  
        totalAmount += total;
        
        return {
          productId: item._id.toString(),
          title: item.name,
          quantity: { count: '1'},
          total: total.toString(),
        }
      })
    
    const paymentData = {
      availablePaymentMethods: ["SPLIT"],
      currencyCode: 'RUB',
      orderId: order._id.toString(),
      cart: {
        items: cartItems,
        total: { amount: totalAmount.toString() },
      },
      redirectUrls: {
        onSuccess: 'https://icegames.store?successPayment=true',
        onError: 'https://icegames.store',
      }
    };
    
    const responseYa = await fetch('https://pay.yandex.ru/api/merchant/v1/orders\n', {
      method: 'POST',
      headers: {
        'Authorization': 'Api-Key bdd92d58cf804adab0ed394d4bc28af7.raWpRwV61YLwlGeV5y1_4UwEaUGz6_3n',
        //'Authorization': 'Api-Key bdd92d58-cf80-4ada-b0ed-394d4bc28af7',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    const resultYa = await responseYa.json();
    
    if (!resultYa.code || resultYa.code !== 200) {
      throw new Error('Technical error');
    }
    
    order.paymentUrl = resultYa.data.paymentUrl;
    order.items = cartItems.map(item => ({
      productId: item.productId,
      sellingPrice: item.total,
    }));
    
    await order.save();
  
    person.cart = person.cart.filter(item => !item.canSplit || item.countKeys === 0);
    
    person.save();
  
    res.json({
      success: true,
      paymentUrl: resultYa.data.paymentUrl,
    });
  } catch (e) {
    console.log(e);
    res.json({ success: false });
  }
}