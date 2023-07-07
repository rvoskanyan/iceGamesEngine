import Key from "../../models/Key.js";
import TurkeyFillUpKey from "../../models/TurkeyFillUpKey.js";

export const ordersPage = async (req, res) => {
  const orders = await Key
    .find({ isSold: true })
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
  
  const turkeyFillUps = await TurkeyFillUpKey
    .find({ isSold: true })
    .sort({updatedAt: -1})
    .limit(50)
    .populate([{
      path: 'turkeyFillUpId',
      select: ['buyerEmail'],
    }])
    .lean();
  
  res.render('admOrders', {
    layout: 'admin',
    orders,
    turkeyFillUps,
  })
}