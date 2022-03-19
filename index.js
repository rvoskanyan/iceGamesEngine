const express = require('express');
const fileUpload = require('express-fileupload');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const varMiddleware = require('./middlewares/variables');
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const MONGODB_URI = `mongodb+srv://Rafik:Z3Akp3gR7aH1tet2@icegamesdev.saekw.mongodb.net/igsDev`;
const app = express();
const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI,
});
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
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
    iff: function (a, operator, b, opts) {
      let bool = false;
      
      switch (operator) {
        case '===':
          bool = a === b;
          break;
        case '>':
          bool = a > b;
          break;
        case '<':
          bool = a < b;
          break;
        case '>=':
          bool = a >= b;
          break;
        case '<==':
          bool = a <= b;
          break;
        case '!==':
          bool = a !== b;
          break;
        default:
          throw `Unknown operator: ${operator}`;
      }
      
      if (bool) {
        return opts.fn(this);
      }
      
      return opts.inverse(this)
    }
  },
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'layout')));
app.use(express.static(path.join(__dirname, 'uploadedFiles')));
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(varMiddleware);
app.use(express.json());
app.use(fileUpload({}));
app.use(cookieParser());

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
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
    });
    mongoose.set('debug', true);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });
  } catch (e) {
    console.log(e);
  }
}

start();