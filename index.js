import express from 'express';
import fileUpload from 'express-fileupload';
import exphbs from 'express-handlebars';
import Handlebars from 'handlebars';
import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongodb-session';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import {__dirname} from "./rootPathes.js";
import varMiddleware from './middlewares/variables.js';
import constClientMiddleware from './middlewares/constClientData.js';
import clientRoutes from './routes/client.js';
import adminRoutes from './routes/admin.js';
import apiRoutes from'./routes/api.js';

dotenv.config();

const MONGODB_URI = `mongodb://Rafik:Z3Akp3gR7aH1tet2@localhost:27017/igsDev?authSource=admin`;
const app = express();
const store = new (MongoStore(session))({
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
    inc: (value) => {
      return parseInt(value) + 1;
    },
    encodeString: (str) => {
      return new Handlebars.SafeString(str);
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
        case '<=':
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
    },
    sub: (lvalue, rvalue) => {
      return lvalue - rvalue;
    },
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
app.use(cookieParser());
app.use(varMiddleware);
app.use(express.json());
app.use(fileUpload({}));

app.use('/', constClientMiddleware, clientRoutes);
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