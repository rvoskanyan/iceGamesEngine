import Key from "../../models/Key.js";

export const ordersPage = async (req, res) => {
  const orders = await Key
    .find({isSold: true})
    .select(['value', 'soldOrder', 'product'])
    .sort({updatedAt: -1})
    .limit(50)
    .populate([
      {
        path: 'soldOrder',
        select: ['buyerEmail'],
      },
      {
        path: 'product',
        select: ['name'],
      }
    ])
    .lean();
  
  res.render('admOrders', {
    layout: 'admin',
    orders,
  })
}