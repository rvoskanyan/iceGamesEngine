import Product from "../../models/Product.js";
import Key from "../../models/Key.js";
import Order from "../../models/Order.js";

export const analyticsPage = async (req, res) => {
  try {
    const endDate = req.query.endDate;
  
    const currentDateTime = endDate ? new Date(endDate) : new Date();
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
        
        const data = await Order.aggregate([
          {
            $match: {
              isDBI: true,
              status: 'paid',
              createdAt: {
                $gte: startDate,
                $lt: endDate,
              }
            }
          },
          {
            $lookup: {
              from: 'keys',
              localField: '_id',
              foreignField: 'soldOrder',
              as: 'keys',
            }
          },
          {
            $project: {
              countSales: { $size: '$keys' },
              cost: { $sum: "$keys.purchasePrice" },
              turnover: { $sum: "$keys.sellingPrice" },
              averageCheck: { $avg: "$keys.sellingPrice" },
              fvp: {
                $reduce: {
                  input: "$keys",
                  initialValue: 0,
                  in: {
                    $add: [
                      "$$value",
                      {
                        $floor: {
                          $subtract: [
                            {
                              $subtract: [
                                "$$this.sellingPrice",
                                { $multiply: ["$$this.sellingPrice", 0.025] }
                              ],
                            },
                            "$$this.purchasePrice",
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: 1,
              countSales: { $sum: "$countSales" },
              cost: { $sum: "$cost" },
              fvp: { $sum: "$fvp" },
              turnover: { $sum: "$turnover" },
              averageCheck: { $avg: { $sum: "$turnover" } },
              countOrders: { $count: {} },
            }
          }
        ]);
  
        return data[0];
      }
    }
    
    const stockData = await Key.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: {
            productId: '$product._id',
            purchasePrice: "$purchasePrice",
          },
          productName: { $first: "$product.name" },
          currentSallePrice: { $first: "$product.priceTo" },
          dsPrice: {
            $first: {
              $add: [
                "$product.dsPrice",
                { $multiply: ["$product.dsPrice", 0.01] }
              ],
            }
          },
          countKeys: { $count: { } },
          countInStock: { $sum: { $cond: ["$isSold", 0, 1] } },
          countSelling: { $sum: { $cond: ["$isSold", 1, 0] } },
          pvpPerSale: {
            $first: {
              $floor: {
                $subtract: [
                  {
                    $subtract: [
                      "$product.priceTo",
                      { $multiply: ["$product.priceTo", 0.025] }
                    ],
                  },
                  "$purchasePrice",
                ],
              }
            }
          },
          fvp: {
            $sum: {
              $cond: [
                "$isSold",
                {
                  $floor: {
                    $subtract: [
                      {
                        $subtract: [
                          "$sellingPrice",
                          { $multiply: ["$sellingPrice", 0.025] }
                        ],
                      },
                      "$purchasePrice",
                    ],
                  }
                },
                0
              ]
            }
          },
        }
      },
      {
        $project: {
          _id: 0,
          productId: '$_id.productId',
          productName: 1,
          purchasePrice: '$_id.purchasePrice',
          countKeys: 1,
          currentSallePrice: 1,
          dsPrice: 1,
          pvpPerSale: 1,
          countInStock: 1,
          pvp: { $multiply: ['$pvpPerSale', '$countInStock'] },
          countSelling: 1,
          fvp: 1,
        }
      },
      {
        $group: {
          _id: 1,
          rows: { $push: "$$ROOT" },
          countItems: { $count: {} },
          totalCountKeys: { $sum: "$countKeys" },
          totalInStockKeys: { $sum: "$countInStock" },
          totalPVP: { $sum: "$pvp" },
          averagePVP: { $avg: "$pvp" },
          totalSellingKeys: { $sum: "$countSelling" },
          totalFVP: { $sum: "$fvp" },
        }
      },
    ]);
    
    const finishedProducts = [];
    const notInStockProducts = await Product.find({countKeys: {$eq: 0}, active: true}).lean();
    
    for (const {_id, name, priceTo, dsPrice} of notInStockProducts) {
      const countKeys = await Key.countDocuments({product: _id});
      
      if (countKeys) {
        finishedProducts.push({ _id, name, priceTo, dsPrice: dsPrice + dsPrice / 100 });
      }
    }
    
    res.render('admAnalytics', {
      layout: 'admin',
      total,
      endDate,
      finishedProducts,
      stockData: stockData[0],
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