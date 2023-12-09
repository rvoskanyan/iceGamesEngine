import express from 'express'
import fileUpload from 'express-fileupload'
import exphbs from 'express-handlebars'
import Handlebars from 'handlebars'
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongodb-session'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import { __dirname } from './rootPathes.js'
import varMiddleware from './middlewares/variables.js'
import constClientMiddleware from './middlewares/constClientData.js'
import clientRoutes from './routes/client.js'
import adminRoutes from './routes/admin.js'
import apiRoutes from './routes/api.js'
import v1Routes from './routes/v1.js'
import { admin } from './middlewares/routeProtection.js'
import webhook from './routes/webhook.js'
import { getFormatDate } from './utils/functions.js'
import { antiDdos } from './middlewares/antiDdos.js'
import { mongoDbUri } from './config.js'

const app = express()
const store = new (MongoStore(session))({
  collection: 'sessions',
  uri: mongoDbUri
})
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    endOfBlock: (index, countItems, last) => {
      return (index + 1) % countItems === 0 && !last
    },
    isLess: (valFrom, valTo) => {
      return valFrom < valTo
    },
    eval: str => {
      return eval(str)
    },
    inc: value => {
      return parseInt(value) + 1
    },
    encodeString: str => {
      return new Handlebars.SafeString(str)
    },
    toStr: value => {
      return value.toString()
    },
    iff: function (a, operator, b, opts) {
      let bool = false

      switch (operator) {
        case '===':
          bool = a === b
          break
        case '>':
          bool = a > b
          break
        case '<':
          bool = a < b
          break
        case '>=':
          bool = a >= b
          break
        case '<=':
          bool = a <= b
          break
        case '!==':
          bool = a !== b
          break
        default:
          throw `Unknown operator: ${operator}`
      }

      if (bool) {
        return opts.fn(this)
      }

      return opts.inverse(this)
    },
    orIf: function () {
      const opts = arguments[arguments.length - 1]
      const args = Object.values(arguments)
      const values = args.slice(0, args.length - 1)
      let trust = false

      if (!values.length) {
        return opts.inverse(this)
      }

      for (const value of values) {
        if (value) {
          trust = true
          break
        }
      }

      if (trust) {
        return opts.fn(this)
      }

      return opts.inverse(this)
    },
    sub: (lvalue, rvalue) => {
      return lvalue - rvalue
    },
    dateFormat(date) {
      return getFormatDate(date, '-', ['d', 'm', 'y'], true)
    }
  }
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'layout')))
app.use(express.static(path.join(__dirname, 'uploadedFiles')))
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
  })
)
app.use(cookieParser())
app.use(varMiddleware)
app.use(express.json())
app.use(fileUpload({}))

app.use('/admin', admin, adminRoutes)
app.use('/api', apiRoutes)
app.use('/webhook', webhook)
app.use('/v1', v1Routes)

app.get('/xbox/blog/:alias', function (request, response) {
  response.redirect(`/blog/${request.params.alias}`)
})

app.use('/xbox/blog/', function (request, response) {
  response.redirect('/blog/')
})

app.get('/xbox/selections/:alias', function (request, response) {
  response.redirect(`/selections/${request.params.alias}`)
})

app.use('/xbox/selections/', function (request, response) {
  response.redirect('/selections/')
})

app.use('/', constClientMiddleware, clientRoutes)

app.use(function (req, res) {
  res.status(404)

  if (req.accepts('html')) {
    return res.render('404', {
      title: 'ICE GAMES — Страница не найдена',
      breadcrumbs: [
        {
          name: 'Страница не найдена',
          current: true
        }
      ]
    })
  }

  if (req.accepts('json')) {
    return res.json({ error: 'Not found' })
  }

  res.type('txt').send('Not found')
})

const PORT = process.env.PORT || 4000
const uploadedFilesDir = path.resolve(__dirname, 'uploadedFiles')

if (!fs.existsSync(uploadedFilesDir)) {
  fs.mkdirSync(uploadedFilesDir)
}

const start = async () => {
  try {
    await mongoose.connect(mongoDbUri, {
      useNewUrlParser: true
    })
    //mongoose.set('debug', true);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
