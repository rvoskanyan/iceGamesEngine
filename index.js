const express = require('express');
const fileUpload = require('express-fileupload');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');
const {sequelize} = require('./models/index');
require('dotenv').config();

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: {
    endOfBlock: (index, countItems, last) => {
      return ((index + 1) % countItems === 0) && !last;
    },
    isLess: (valFrom, valTo) => {
      return valFrom < valTo;
    },
    eval: (str) => {
      return eval(str);
    },
  },
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'layout')));
app.use(express.static(path.join(__dirname, 'uploadedFiles')));
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({}));
app.use('/', clientRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 4000;
const uploadedFilesDir = path.resolve(__dirname, 'uploadedFiles');

if (!fs.existsSync(uploadedFilesDir)) {
  fs.mkdirSync(uploadedFilesDir);
}

const start = async () => {
  try {
    await sequelize.authenticate();
    //await sequelize.sync({alter: true});
    
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

start();