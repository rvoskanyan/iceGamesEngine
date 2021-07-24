const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
//const sequelize = require('./utils/database');
const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/client');
//const models = require('./models1/connections');
const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
})

app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use('/admin', adminRoutes);
app.use('/', clientRoutes);

const PORT = process.env.PORT || 80;

const start = async () => {
  try {
    //await sequelize.authenticate();
    //await sequelize.sync();
    
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

start();