const express = require('express');
const fileUpload = require('express-fileupload');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/client');
const {sequelize} = require('./models/index');
require('dotenv').config();

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: {
    isSecond: (value) => {
      return (value + 1) % 2 === 0;
    },
  },
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploadedFiles')));
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({}));
app.use('/admin', adminRoutes);
app.use('/', clientRoutes);

const PORT = process.env.PORT || 4000;
const uploadedFilesDir = path.resolve(__dirname, 'uploadedFiles');

if (!fs.existsSync(uploadedFilesDir)) {
  fs.mkdirSync(uploadedFilesDir);
}

console.log(process.env.NODE_ENV);

const start = async () => {
  try {
    await sequelize.authenticate();
    //await sequelize.sync({});
    
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

start();