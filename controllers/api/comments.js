import Product from "./../../models/Product.js";
import Comment from "./../../models/Comment.js";

export const getComments = async (req, res) => {
  try {
    const {
      skip = 0,
      limit = 3,
      subjectId,
      ref,
    } = req.query;
  
  
    console.log(skip);
    
    const comments = await Comment
      .find({ref, subjectId})
      .skip(skip)
      .limit(limit)
      .populate(['author'])
      .sort({createdAt: -1});
    
    res.json({
      items: comments,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
    });
  }
}

export const addComment = async (req, res) => {
  try {
    const {
      text,
      subjectId,
      ref,
      parentComment = null,
      answerFor = null,
    } = req.body;
    let subjectExists = false;
    
    if (!req.session.isAuth) {
      throw new Error('Not auth');
    }
    
    if (typeof text !== "string" || !text) {
      throw new Error('Not found text');
    }
    
    if (ref === 'product') {
      subjectExists = await Product.exists({_id: subjectId});
    }
    
    if (!subjectExists) {
      throw new Error('Is subject not exists');
    }
    
    const comment = new Comment({
      author: res.locals.person._id,
      text,
      subjectId,
      ref,
    });
    
    await comment.save();
    
    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: true,
    });
  }
}