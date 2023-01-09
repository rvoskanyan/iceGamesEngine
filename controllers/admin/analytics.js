import Product from "../../models/Product.js";
import Key from "../../models/Key.js";

export const analyticsPage = async (req, res) => {
  try {
    const products = await Product.find({countKeys: {$gt: 0}}).select(['name', 'priceTo', 'dsPrice']).lean();
    let totalCountKeys = 0;
    let totalInStockKeys = 0;
    let totalPVP = 0;
    let totalSellingKeys = 0;
    let totalFVP = 0;
    let rows = [];
    
    for (const product of products) {
      const groups = await Key.aggregate([
        {
          $match: {
            product: product._id,
            purchasePrice: {$gt: 0},
          }
        },
        {
          $group: {
            _id: '$purchasePrice',
            count: { $count: { } },
            keys: { $push: {
              isActive: "$isActive",
              isSold: "$isSold",
              sellingPrice: "$sellingPrice",
              purchasePrice: "$purchasePrice",
            }},
          }
        },
        {$sort: {_id: 1}},
      ]);
      
      if (!groups.length) {
        continue;
      }
  
      groups.forEach(group => {
        const purchasePrice = group._id;
        const currentSallePrice = product.priceTo;
        const pvpPerSale = Math.floor((currentSallePrice - currentSallePrice * 0.025 - purchasePrice) * 100) / 100;
        let countInStock = 0;
        let countSelling = 0;
        let fvp = 0;
  
        group.keys.forEach(key => {
          if (!key.isSold) {
            return countInStock++
          }
  
          countSelling++;
          
          if (!key.sellingPrice) {
            key.sellingPrice = 0;
          }
  
          fvp += Math.floor((key.sellingPrice - key.sellingPrice * 0.025 - key.purchasePrice) * 100) / 100;
        });
        
        rows.push({
          productId: product._id,
          productName: product.name,
          purchasePrice,
          countKeys: group.count,
          currentSallePrice,
          dsPrice: product.dsPrice + product.dsPrice * 0.01,
          pvpPerSale,
          countInStock,
          pvp: pvpPerSale * countInStock,
          countSelling,
          fvp,
        });
  
        totalCountKeys += group.count;
        totalInStockKeys += countInStock;
        totalPVP += pvpPerSale * countInStock;
        totalSellingKeys += countSelling;
        totalFVP += fvp;
      });
    }
    
    res.render('admAnalytics', {
      layout: 'admin',
      rows,
      totalCountKeys,
      totalInStockKeys,
      totalPVP,
      totalSellingKeys,
      totalFVP,
    });
  } catch (e) {
    console.log(e);
    
    res.redirect('/admin');
  }
}