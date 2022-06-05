import path from "path";
import exceljs from "exceljs";
import Product from "../../models/Product.js";
import {__dirname} from "../../rootPathes.js";

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