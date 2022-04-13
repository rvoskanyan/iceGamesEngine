import Mongoose from "mongoose";

const {Schema, model} = Mongoose;
const fields = {
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  ref: {
    type: String,
    required: true,
    enum: ['product'],
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  answerFor: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
};

const options = {
  timestamps: true,
};

const CommentSchema = new Schema(fields, options);

export default model('Comment', CommentSchema);