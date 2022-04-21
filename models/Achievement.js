import Mongoose from 'mongoose';
import {typesAchievements} from './../utils/constants.js';

const {Schema, model} = Mongoose;
const fields = {
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: Object.keys(typesAchievements),
  },
  amount: {
    type: Number,
    required: true,
  }
};

const options = {
  timestamps: true,
};

const achievementSchema = new Schema(fields, options);

export default model('Achievement', achievementSchema);