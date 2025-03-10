import path from "path";
import exceljs from "exceljs";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import {__dirname} from "../../rootPathes.js";
import fs from "fs";
import {getFormatDate} from "../../utils/functions.js";

export const exportProductInStock = async (req, res) => {
  try {
    const products = await Product.find({inStock: true}).select('name').lean();
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Products In Stock');
  
    worksheet.columns = [{header: 'Название товара', key: 'name', width: 10}];
    
    products.forEach(product => {
      worksheet.addRow(product);
    });
  
    await workbook.xlsx.writeFile(path.join(__dirname, 'uploadedFiles/products_in_stock.xlsx'));
    
    res.redirect('/products_in_stock.xlsx');
  } catch (e) {
    console.log(e);
    res.redirect('/admin')
  }
}

export const monthlySales = async (req, res) => {
  try {
    const fileName = '/monthly-sales.xlsx';
    const date = new Date();
    
    date.setMonth(date.getMonth() - 1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    
    const orders = await Order
      .find({
        isDBI: true,
        status: 'paid',
        createdAt: {$gte: date},
      })
      .sort({createdAt: 1, buyerEmail: -1})
      .select(['buyerEmail', 'items', 'createdAt'])
      .populate([{
        path: 'items.productId',
        select: ['name'],
      }])
      .lean();
    
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Monthly sales');
    
    worksheet.columns = [
      {header: 'E-mail', key: 'email', width: 10},
      {header: 'Название товара', key: 'name', width: 10},
      {header: 'Цена покупки', key: 'price', width: 10},
      {header: 'Дата покупки', key: 'date', width: 10},
    ];
  
    orders.forEach(order => {
      const email = order.buyerEmail;
      const date = getFormatDate(order.createdAt, '-', ['d', 'm', 'y']);
      
      order.items.forEach(item => {
        const price = item.sellingPrice;
        const name = item.productId.name;
  
        worksheet.addRow({
          email,
          price,
          name,
          date,
        });
      })
    });
    
    const dir = path.join(__dirname, 'secureFiles');
    const filePath = dir + fileName;
  
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    
    await workbook.xlsx.writeFile(filePath);
  
    res.sendFile(filePath);
  } catch (e) {
    console.log(e);
    res.redirect('/admin')
  }
}