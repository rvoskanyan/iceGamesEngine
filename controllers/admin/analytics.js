import Product from "../../models/Product.js";
import Key from "../../models/Key.js";
import Order from "../../models/Order.js";
import {getFormatDate} from "../../utils/functions.js";

export const analyticsPage = async (req, res) => {
  try {
    const products = await Product.find({countKeys: {$gt: 0}}).select(['name', 'priceTo', 'dsPrice']).lean();
    let totalCountKeys = 0;
    let totalInStockKeys = 0;
    let totalPVP = 0;
    let totalSellingKeys = 0;
    let totalFVP = 0;
    let rows = [];
  
    const currentDateTime = new Date();
    const todayDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());
    const labels = [];
    const currentCountSales = [];
    const currentCost = [];
    const currentFvp = [];
    const currentTurnover = [];
    const currentCountOrders = [];
    const currentAverageCheck = [];
    const previousCountSales = [];
    const previousCost = [];
    const previousFvp = [];
    const previousTurnover = [];
    const previousCountOrders = [];
    const previousAverageCheck = [];
    const indicatorsBlank = {
      countSales: 0,
      cost: 0,
      fvp: 0,
      turnover: 0,
      countOrders: 0,
      averageCheck: 0,
    };
    const total = {
      week: {
        current: {...indicatorsBlank},
        prev: {...indicatorsBlank},
      },
      month: {
        current: {...indicatorsBlank},
        prev: {...indicatorsBlank},
      },
    };
    
    for (let i = 30; i >= 0; i--) {
      const dateForCurrent = new Date(todayDate);
      const dateForPrevious = new Date(todayDate);
  
      dateForCurrent.setDate(dateForCurrent.getDate() - i);
      dateForPrevious.setDate(dateForPrevious.getDate() - i - 30);
  
      const label = dateForCurrent.getDate();
      const currentData = await getDataPerDay(dateForCurrent);
      const previousData = await getDataPerDay(dateForPrevious);
  
      currentCountSales.push(currentData.countSales);
      currentCost.push(currentData.cost);
      currentFvp.push(currentData.fvp);
      currentTurnover.push(currentData.turnover);
      currentCountOrders.push(currentData.countOrders);
      currentAverageCheck.push(currentData.averageCheck);
  
      previousCountSales.push(previousData.countSales);
      previousCost.push(previousData.cost);
      previousFvp.push(previousData.fvp);
      previousTurnover.push(previousData.turnover);
      previousCountOrders.push(previousData.countOrders);
      previousAverageCheck.push(previousData.averageCheck);
  
      total.month.current.countSales += currentData.countSales;
      total.month.current.cost += currentData.cost;
      total.month.current.fvp += currentData.fvp;
      total.month.current.turnover += currentData.turnover;
      total.month.current.countOrders += currentData.countOrders;
      total.month.current.averageCheck += currentData.averageCheck;
  
      total.month.prev.countSales += previousData.countSales;
      total.month.prev.cost += previousData.cost;
      total.month.prev.fvp += previousData.fvp;
      total.month.prev.turnover += previousData.turnover;
      total.month.prev.countOrders += previousData.countOrders;
      total.month.prev.averageCheck += previousData.averageCheck;
      
      if (i < 14 && i > 6) {
        total.week.prev.countSales += currentData.countSales;
        total.week.prev.cost += currentData.cost;
        total.week.prev.fvp += currentData.fvp;
        total.week.prev.turnover += currentData.turnover;
        total.week.prev.countOrders += currentData.countOrders;
        total.week.prev.averageCheck += currentData.averageCheck;
      }
      
      if (i < 7) {
        total.week.current.countSales += currentData.countSales;
        total.week.current.cost += currentData.cost;
        total.week.current.fvp += currentData.fvp;
        total.week.current.turnover += currentData.turnover;
        total.week.current.countOrders += currentData.countOrders;
        total.week.current.averageCheck += currentData.averageCheck;
      }
      
      labels.push(label < 10 ? `0${label}` : label.toString());
  
      async function getDataPerDay(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        
        const orders = await Order.find({isDBI: true, status: 'paid', createdAt: {
            $gte: startDate,
            $lt: endDate,
        }}).lean();
        const keys = [];
        const countOrders = orders.length;
        let cost = 0;
        let fvp = 0;
        let turnover = 0;
  
        for (const order of orders) {
          const orderKeys = await Key.find({soldOrder: order._id}).lean();
    
          Array.prototype.push.apply(keys, orderKeys);
        }
  
        keys.forEach(key => {
          const {
            purchasePrice,
            sellingPrice,
          } = key;
    
          cost += purchasePrice;
          fvp += Math.floor((sellingPrice - sellingPrice * 0.025 - purchasePrice) * 100) / 100;
          turnover += sellingPrice;
        });
  
        return {
          countSales: keys.length || 0,
          cost: cost || 0,
          fvp: fvp || 0,
          turnover: turnover || 0,
          countOrders: countOrders || 0,
          averageCheck: (turnover / countOrders) || 0,
        };
      }
    }
    
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
      total,
      currentCountSales: JSON.stringify(currentCountSales),
      currentCost: JSON.stringify(currentCost),
      currentFvp: JSON.stringify(currentFvp),
      currentTurnover: JSON.stringify(currentTurnover),
      currentCountOrders: JSON.stringify(currentCountOrders),
      currentAverageCheck: JSON.stringify(currentAverageCheck),
      previousCountSales: JSON.stringify(previousCountSales),
      previousCost: JSON.stringify(previousCost),
      previousFvp: JSON.stringify(previousFvp),
      previousTurnover: JSON.stringify(previousTurnover),
      previousCountOrders: JSON.stringify(previousCountOrders),
      previousAverageCheck: JSON.stringify(previousAverageCheck),
      labels: JSON.stringify(labels),
    });
  } catch (e) {
    console.log(e);
    
    res.redirect('/admin');
  }
}

export const userAnalyticsPage = async (req, res) => {
  try {
    await Order.deleteMany({buyerEmail: undefined, userId: undefined, status: 'awaiting'});
    
    const startPeriodDate = new Date();
  
    startPeriodDate.setDate(startPeriodDate.getDate() - 30);
    startPeriodDate.setHours(0);
    startPeriodDate.setMinutes(0);
    startPeriodDate.setSeconds(0);
    
    let rows = await Order.aggregate([
      {$lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      }},
      {$replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$user", 0 ] }, "$$ROOT" ] } }},
      {$match: {
        status: 'paid',
        $or: [
          {bot: undefined},
          {bot: false},
        ],
      }},
      {
        $project: {
          orderSalesCount: { $size: "$items" },
          orderRevenue: { $sum: "$items.sellingPrice" },
          orderLastSales: {$cond: [{$gte: ['$createdAt', startPeriodDate]}, { $size: "$items" }, 0]},
          buyerEmail: 1,
          createdAt: 1,
        }
      },
      {
        $group: {
          _id: '$buyerEmail',
          totalSales: {$sum: "$orderSalesCount"},
          countLastSales: {$sum: "$orderLastSales"},
          lastSaleDate: { $max: "$createdAt"},
          revenue: {$sum: "$orderRevenue"},
        },
      },
      {
        $project: {
          _id: 1,
          totalSales: 1,
          countLastSales: 1,
          lastSaleDate: 1,
          revenue: {$round : ["$revenue", 0]},
          averageCheck: {$round : [ { $divide: [ "$revenue", "$totalSales" ] }, 0]},
        }
      },
      {$sort: {revenue: -1}}
    ]);
    
    res.render('admUserAnalytics', {
      layout: 'admin',
      rows,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}