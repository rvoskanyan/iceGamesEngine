import {startParsingProducts} from "../../services/parsing.js";

export const parsingPage = (req, res) => {
  res.render('parsing', {
    layout: 'admin',
    parsing: process.env.PARSING,
  })
}

export const startParsing = (req, res) => {
  startParsingProducts();
  process.env.PARSING = '1';
  res.redirect('/admin/parsing');
}