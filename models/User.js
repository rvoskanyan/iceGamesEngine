import Mongoose from 'mongoose';
import {achievementEvent} from "../services/achievement.js";

const {Schema, model} = Mongoose;
const fields = {
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  login: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  purchasedProducts: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  inviter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  invitedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  role: {
    type: String,
    required: true,
    enum: ['client', 'admin'],
    default: 'client',
  },
  dsCartId: String,
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  viewedArticles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  likedArticles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  favoritesProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  viewedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
  }],
  achievements: [{
    type: Schema.Types.ObjectId,
    ref: 'Achievement',
  }],
  emailChecked: {
    type: Boolean,
    default: false,
  },
  checkEmailHash: String,
  locked: {
    type: Boolean,
    default: false,
  },
  lockingMessage: String,
  active: {
    type: Boolean,
    default: true,
  },
};

const options = {
  timestamps: true,
};

const userSchema = new Schema(fields, options);

userSchema.virtual('daysUs').get(function () {
  const user = this;
  const startDate = user.createdAt;
  const currentDate = new Date();
  
  return Math.ceil(Math.abs(currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
});

userSchema.methods.increaseRating = async function (count) {
  try {
    this.rating += count;
    await this.save();
    await achievementEvent('topRanking', this);
  } catch (e) {
    console.log(e);
  }
}

userSchema.methods.getRatingPosition = async function () {
  try {
    const users = await this.model('User')
      .find()
      .sort({rating: -1, createdAt: 1})
      .select('_id')
      .lean();
  
    return users.findIndex(user => user._id.toString() === this._id.toString()) + 1;
  
    /* -- Протестировать метод на ресурсоемкость в будущем при существенном количестве пользователей, т.к. findIndex теряет эффективность
    //Получаем позицию крайнего пользователя в рейтинге с таким же количеством баллов, как у текущего
    const lastPosition = this.model('User').countDocuments({rating: {$gte: this.rating}});
    //Получаем количество пользователей с рейтингом, равным рейтингу текущего
    const countWithThisRating = this.model('User').countDocuments({rating: {$eq: this.rating}});
    //Расчитываем количество пользователей, с рейтингом выше, чем рейтинг текущего пользователя, которых пропускаем
    const skip = lastPosition - countWithThisRating;
    //Получаем списко пользователей с рейтингом, равным рейтингу текущего, учитывая дату регистрации
    const listWithThisRating = await this.model('User')
      .find()
      .sort({rating: -1, createdAt: 1})
      .skip(skip)
      .limit(countWithThisRating)
      .select('_id')
      .lean();
    //Возвращаем позицию в рейтинге текущего пользователя
    return skip + listWithThisRating.findIndex(user => user._id.toString() === this._id.toString()) + 1;
    */
  } catch (e) {
    console.log(e);
  }
}

export default model('User', userSchema);